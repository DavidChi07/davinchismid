require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// POST /api/ordenes — crear orden
const crearOrden = async (req, res) => {
  const { items } = req.body;
  const usuarioId = req.usuario.id;

  // Verificar que todos los productos existen y están disponibles
  const productosIds = items.map(i => i.productoId);
  const productos = await prisma.producto.findMany({
    where: { id: { in: productosIds }, disponible: true }
  });

  if (productos.length !== productosIds.length) {
    return res.status(400).json({
      error: 'Uno o más platillos no están disponibles'
    });
  }

  // Calcular total
  const itemsConPrecio = items.map(item => {
    const producto = productos.find(p => p.id === item.productoId);
    return {
      productoId: item.productoId,
      cantidad: item.cantidad,
      precio: producto.precio
    };
  });

  const total = itemsConPrecio.reduce(
    (sum, item) => sum + item.precio * item.cantidad, 0
  );

  // Crear orden con sus items en una sola transacción
  const orden = await prisma.orden.create({
    data: {
      usuarioId,
      total,
      items: {
        create: itemsConPrecio
      }
    },
    include: {
      items: {
        include: { producto: true }
      },
      usuario: {
        select: { nombre: true, email: true }
      }
    }
  });

  res.status(201).json({
    mensaje: '¡Orden creada exitosamente!',
    orden
  });
};

// GET /api/ordenes — mis órdenes
const getMisOrdenes = async (req, res) => {
  const ordenes = await prisma.orden.findMany({
    where: { usuarioId: req.usuario.id },
    include: {
      items: {
        include: {
          producto: {
            select: { nombre: true, imagen: true }
          }
        }
      }
    },
    orderBy: { creadoEn: 'desc' }
  });

  res.json({ total: ordenes.length, ordenes });
};

// GET /api/ordenes/:id — detalle de una orden
const getOrdenById = async (req, res) => {
  const id = parseInt(req.params.id);

  const orden = await prisma.orden.findUnique({
    where: { id },
    include: {
      items: {
        include: { producto: true }
      },
      usuario: {
        select: { nombre: true, email: true }
      }
    }
  });

  if (!orden) {
    return res.status(404).json({ error: 'Orden no encontrada' });
  }

  // Solo el dueño de la orden o un admin puede verla
  if (orden.usuarioId !== req.usuario.id && req.usuario.rol !== 'admin') {
    return res.status(403).json({ error: 'No tienes acceso a esta orden' });
  }

  res.json(orden);
};

// PUT /api/ordenes/:id/status — actualizar status (solo admin)
const actualizarStatus = async (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;

  const statusValidos = ['pendiente', 'confirmada', 'preparando', 'lista', 'entregada', 'cancelada'];

  if (!statusValidos.includes(status)) {
    return res.status(400).json({
      error: `Status inválido. Debe ser uno de: ${statusValidos.join(', ')}`
    });
  }

  const orden = await prisma.orden.findUnique({ where: { id } });
  if (!orden) return res.status(404).json({ error: 'Orden no encontrada' });

  const actualizada = await prisma.orden.update({
    where: { id },
    data: { status },
    include: {
      items: { include: { producto: true } },
      usuario: { select: { nombre: true, email: true } }
    }
  });

  res.json({
    mensaje: `Orden actualizada a: ${status}`,
    orden: actualizada
  });
};

// GET /api/ordenes/todas — todas las órdenes (solo admin)
const getTodasOrdenes = async (req, res) => {
  const ordenes = await prisma.orden.findMany({
    include: {
      items: { include: { producto: true } },
      usuario: { select: { nombre: true, email: true } }
    },
    orderBy: { creadoEn: 'desc' }
  });

  res.json({ total: ordenes.length, ordenes });
};

module.exports = {
  crearOrden,
  getMisOrdenes,
  getOrdenById,
  actualizarStatus,
  getTodasOrdenes
};