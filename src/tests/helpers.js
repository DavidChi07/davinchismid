require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Limpia las tablas antes de cada suite de tests
const limpiarDB = async () => {
  await prisma.ordenItem.deleteMany();
  await prisma.orden.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.producto.deleteMany();
};

// Crea un producto de prueba
const crearProductoPrueba = async (datos = {}) => {
  return prisma.producto.create({
    data: {
      nombre: 'Cochinita Pibil Test',
      descripcion: 'Platillo de prueba',
      precio: 120,
      categoria: 'plato fuerte',
      ...datos
    }
  });
};

// Crea un usuario de prueba y devuelve su token
const crearUsuarioPrueba = async (rol = 'cliente') => {
  const bcrypt = require('bcryptjs');
  const jwt = require('jsonwebtoken');

  const usuario = await prisma.usuario.create({
    data: {
      nombre: 'Usuario Test',
      email: `test_${Date.now()}@test.com`,
      password: await bcrypt.hash('123456', 10),
      rol
    }
  });

  const token = jwt.sign(
    { id: usuario.id, email: usuario.email, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  return { usuario, token };
};

module.exports = { prisma, limpiarDB, crearProductoPrueba, crearUsuarioPrueba };