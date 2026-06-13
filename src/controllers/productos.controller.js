// src/controllers/productos.controller.js
const prisma = require('../config/prisma');

const getProductos = async (req, res) => {
  const { categoria, disponible } = req.query;

  const where = {};
  if (categoria) where.categoria = categoria;
  if (disponible !== undefined) where.disponible = disponible === 'true';

  const productos = await prisma.producto.findMany({
    where,
    orderBy: { creadoEn: 'desc' }
  });

  res.json({ total: productos.length, productos });
};

const getProductoById = async (req, res) => {
  const producto = await prisma.producto.findUnique({
    where: { id: parseInt(req.params.id) }
  });

  if (!producto) return res.status(404).json({ error: 'Platillo no encontrado' });
  res.json(producto);
};

const createProducto = async (req, res) => {
  const producto = await prisma.producto.create({ data: req.body });
  res.status(201).json(producto);
};

const updateProducto = async (req, res) => {
  const id = parseInt(req.params.id);
  const existe = await prisma.producto.findUnique({ where: { id } });

  if (!existe) return res.status(404).json({ error: 'Platillo no encontrado' });

  const actualizado = await prisma.producto.update({
    where: { id },
    data: req.body
  });

  res.json(actualizado);
};

const deleteProducto = async (req, res) => {
  const id = parseInt(req.params.id);
  const existe = await prisma.producto.findUnique({ where: { id } });

  if (!existe) return res.status(404).json({ error: 'Platillo no encontrado' });

  const eliminado = await prisma.producto.delete({ where: { id } });
  res.json({ mensaje: `"${eliminado.nombre}" eliminado correctamente` });
};

module.exports = { getProductos, getProductoById, createProducto, updateProducto, deleteProducto };