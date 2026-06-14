const express = require('express');
const cors = require('cors');
const app = express();

const productosRoutes = require('./routes/productos.routes');
const authRoutes = require('./routes/auth.routes');
const ordenRoutes = require('./routes/orden.routes');

app.use(cors());
app.use(express.json());

app.use('/api/auth',      authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/ordenes',   ordenRoutes);

app.get('/', (req, res) => {
  res.json({
    tienda: 'DavinchisMid',
    descripcion: 'Auténtica comida yucateca',
    status: 'funcionando'
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

module.exports = app;