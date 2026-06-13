const express = require('express');
const path = require('path');
const app = express();

const productosRoutes = require('./routes/productos.routes');
const authRoutes = require('./routes/auth.routes');
const ordenRoutes = require('./routes/orden.routes');

app.use(express.json());

// Rutas API
app.use('/api/auth',      authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/ordenes',   ordenRoutes);

// Servir frontend compilado en producción
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../public')));

  // Cualquier ruta que no sea /api redirige al index.html de React
  app.get('/{*path}', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({
      tienda: 'DavinchisMid',
      descripcion: 'Auténtica comida yucateca',
      status: 'funcionando',
      endpoints: {
        auth: '/api/auth',
        productos: '/api/productos',
        ordenes: '/api/ordenes'
      }
    });
  });
}

// Middleware de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

module.exports = app;