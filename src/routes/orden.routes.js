const express = require('express');
const router = express.Router();
const {
  crearOrden,
  getMisOrdenes,
  getOrdenById,
  actualizarStatus,
  getTodasOrdenes
} = require('../controllers/orden.controller');
const { autenticar, soloAdmin } = require('../middlewares/auth.middleware');
const validar = require('../middlewares/validar.middleware');
const { crearOrdenSchema } = require('../schemas/orden.schema');

// Todas las rutas requieren autenticación
router.use(autenticar);

router.post('/',                 validar(crearOrdenSchema), crearOrden);
router.get('/',                  getMisOrdenes);
router.get('/todas',             soloAdmin,                 getTodasOrdenes);
router.get('/:id',               getOrdenById);
router.put('/:id/status',        soloAdmin,                 actualizarStatus);

module.exports = router;