require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// POST /api/auth/registro
const registro = async (req, res) => {
  const { nombre, email, password } = req.body;

  // Verificar si el email ya existe
  const existe = await prisma.usuario.findUnique({ where: { email } });
  if (existe) {
    return res.status(400).json({ error: 'El email ya está registrado' });
  }

  // Encriptar contraseña
  const hash = await bcrypt.hash(password, 10);

  // Crear usuario
  const usuario = await prisma.usuario.create({
    data: { nombre, email, password: hash }
  });

  // Generar token
  const token = jwt.sign(
    { id: usuario.id, email: usuario.email, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  res.status(201).json({
    mensaje: '¡Bienvenido a DavinchisMid!',
    token,
    usuario: {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol
    }
  });
};

// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;

  // Buscar usuario
  const usuario = await prisma.usuario.findUnique({ where: { email } });
  if (!usuario) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  // Verificar contraseña
  const passwordValido = await bcrypt.compare(password, usuario.password);
  if (!passwordValido) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  // Generar token
  const token = jwt.sign(
    { id: usuario.id, email: usuario.email, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  res.json({
    mensaje: `¡Bienvenido de vuelta, ${usuario.nombre}!`,
    token,
    usuario: {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol
    }
  });
};

// GET /api/auth/perfil
const perfil = async (req, res) => {
  const usuario = await prisma.usuario.findUnique({
    where: { id: req.usuario.id },
    select: { id: true, nombre: true, email: true, rol: true, creadoEn: true }
  });

  res.json(usuario);
};

module.exports = { registro, login, perfil };