const express = require('express');
const router = express.Router();
const { registro, login, perfil } = require('../controllers/auth.controller');
const { autenticar } = require('../middlewares/auth.middleware');
const validar = require('../middlewares/validar.middleware');
const { registroSchema, loginSchema } = require('../schemas/usuario.schema');

router.post('/registro', validar(registroSchema), registro);
router.post('/login',    validar(loginSchema),    login);
router.get('/perfil',    autenticar,              perfil);

module.exports = router;