const { z } = require('zod');

const registroSchema = z.object({
  nombre: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres'),

  email: z.string()
    .email('El email no es válido'),

  password: z.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
});

const loginSchema = z.object({
  email: z.string()
    .email('El email no es válido'),

  password: z.string()
    .min(1, 'La contraseña es requerida')
});

module.exports = { registroSchema, loginSchema };