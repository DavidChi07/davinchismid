// src/schemas/producto.schema.js
const { z } = require('zod');

const categorias = ['plato fuerte', 'sopa', 'antojo', 'postre', 'bebida'];

const productoSchema = z.object({
  nombre: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre es demasiado largo'),

  descripcion: z.string()
    .max(300, 'La descripción no puede exceder 300 caracteres')
    .optional(),

  precio: z.number()
    .positive('El precio debe ser mayor a 0')
    .max(9999, 'El precio no puede exceder $9,999'),

  categoria: z.enum(categorias, {
    errorMap: () => ({
      message: `La categoría debe ser una de: ${categorias.join(', ')}`
    })
  }),

  disponible: z.boolean().optional().default(true),

  imagen: z.string().optional().default('default.jpg')
});

// Para actualizaciones, todos los campos son opcionales
const productoUpdateSchema = productoSchema.partial();

module.exports = { productoSchema, productoUpdateSchema };