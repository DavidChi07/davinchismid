const { z } = require('zod');

const agregarItemSchema = z.object({
  productoId: z.number()
    .int('El ID debe ser un número entero')
    .positive('El ID debe ser mayor a 0'),

  cantidad: z.number()
    .int('La cantidad debe ser un número entero')
    .min(1, 'La cantidad mínima es 1')
    .max(20, 'La cantidad máxima es 20')
});

const crearOrdenSchema = z.object({
  items: z.array(agregarItemSchema)
    .min(1, 'La orden debe tener al menos un platillo')
});

module.exports = { agregarItemSchema, crearOrdenSchema };