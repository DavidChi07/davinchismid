const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

const productosRoutes = require('./routes/productos.routes');
const authRoutes = require('./routes/auth.routes');
const ordenRoutes = require('./routes/orden.routes');

app.use(express.json());

app.use('/api/auth',      authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/ordenes',   ordenRoutes);

const publicPath = path.join(__dirname, '../public');
const indexPath  = path.join(publicPath, 'index.html');

if (process.env.NODE_ENV === 'production' && fs.existsSync(indexPath)) {
  app.use(express.static(publicPath));
  app.get('/{*path}', (req, res) => {
    res.sendFile(indexPath);
  });
} else {
  app.get('/', (req, res) => {
    res.json({
      tienda: 'DavinchisMid',
      descripcion: 'Auténtica comida yucateca',
      status: 'funcionando'
    });
  });
}

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

module.exports = app;