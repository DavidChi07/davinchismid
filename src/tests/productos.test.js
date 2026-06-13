require('dotenv').config();
const request = require('supertest');
const app = require('../app');
const { limpiarDB, crearProductoPrueba, crearUsuarioPrueba } = require('./helpers');

beforeEach(async () => await limpiarDB());

describe('GET /api/productos', () => {
  it('debe devolver lista de productos', async () => {
    await crearProductoPrueba();
    await crearProductoPrueba({ nombre: 'Sopa de Lima Test', categoria: 'sopa', precio: 85 });

    const res = await request(app).get('/api/productos');

    expect(res.status).toBe(200);
    expect(res.body.total).toBe(2);
    expect(res.body.productos).toHaveLength(2);
  });

  it('debe filtrar por categoría', async () => {
    await crearProductoPrueba({ categoria: 'sopa' });
    await crearProductoPrueba({ nombre: 'Marquesitas Test', categoria: 'postre' });

    const res = await request(app).get('/api/productos?categoria=sopa');

    expect(res.status).toBe(200);
    expect(res.body.total).toBe(1);
    expect(res.body.productos[0].categoria).toBe('sopa');
  });
});

describe('POST /api/productos', () => {
  it('debe crear un producto si es admin', async () => {
    const { token } = await crearUsuarioPrueba('admin');

    const res = await request(app)
      .post('/api/productos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nombre: 'Kibis Test',
        descripcion: 'Descripción test',
        precio: 55,
        categoria: 'antojo'
      });

    expect(res.status).toBe(201);
    expect(res.body.nombre).toBe('Kibis Test');
  });

  it('debe rechazar si no hay token', async () => {
    const res = await request(app)
      .post('/api/productos')
      .send({ nombre: 'Test', precio: 50, categoria: 'antojo' });

    expect(res.status).toBe(401);
  });

  it('debe rechazar si no es admin', async () => {
    const { token } = await crearUsuarioPrueba('cliente');

    const res = await request(app)
      .post('/api/productos')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Test', precio: 50, categoria: 'antojo' });

    expect(res.status).toBe(403);
  });

  it('debe rechazar precio negativo', async () => {
    const { token } = await crearUsuarioPrueba('admin');

    const res = await request(app)
      .post('/api/productos')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Test', precio: -10, categoria: 'antojo' });

    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/productos/:id', () => {
  it('debe eliminar un producto si es admin', async () => {
    const { token } = await crearUsuarioPrueba('admin');
    const producto = await crearProductoPrueba();

    const res = await request(app)
      .delete(`/api/productos/${producto.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.mensaje).toMatch(/eliminado/i);
  });

  it('debe devolver 404 si el producto no existe', async () => {
    const { token } = await crearUsuarioPrueba('admin');

    const res = await request(app)
      .delete('/api/productos/99999')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});