const express = require('express');
const router = express.Router();
const {
  getProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto
} = require('../controllers/productos.controller');
const validar = require('../middlewares/validar.middleware');
const { productoSchema, productoUpdateSchema } = require('../schemas/producto.schema');
const { autenticar, soloAdmin } = require('../middlewares/auth.middleware');

// Rutas públicas
router.get('/',    getProductos);
router.get('/:id', getProductoById);

// Rutas protegidas — solo admin
router.post('/',     autenticar, soloAdmin, validar(productoSchema),       createProducto);
router.put('/:id',   autenticar, soloAdmin, validar(productoUpdateSchema),  updateProducto);
router.delete('/:id',autenticar, soloAdmin,                                deleteProducto);

module.exports = router;