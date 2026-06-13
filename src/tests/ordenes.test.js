require('dotenv').config();
const request = require('supertest');
const app = require('../app');
const { limpiarDB, crearProductoPrueba, crearUsuarioPrueba } = require('./helpers');

beforeEach(async () => await limpiarDB());

describe('POST /api/ordenes', () => {
  it('debe crear una orden correctamente', async () => {
    const { token } = await crearUsuarioPrueba('cliente');
    const producto = await crearProductoPrueba();

    const res = await request(app)
      .post('/api/ordenes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        items: [{ productoId: producto.id, cantidad: 2 }]
      });

    expect(res.status).toBe(201);
    expect(res.body.orden.total).toBe(producto.precio * 2);
    expect(res.body.orden.items).toHaveLength(1);
  });

  it('debe rechazar sin autenticación', async () => {
    const producto = await crearProductoPrueba();

    const res = await request(app)
      .post('/api/ordenes')
      .send({ items: [{ productoId: producto.id, cantidad: 1 }] });

    expect(res.status).toBe(401);
  });

  it('debe rechazar productos no disponibles', async () => {
    const { token } = await crearUsuarioPrueba('cliente');
    const producto = await crearProductoPrueba({ disponible: false });

    const res = await request(app)
      .post('/api/ordenes')
      .set('Authorization', `Bearer ${token}`)
      .send({ items: [{ productoId: producto.id, cantidad: 1 }] });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/no están disponibles/i);
  });
});

describe('GET /api/ordenes/todas', () => {
  it('debe devolver todas las órdenes si es admin', async () => {
    const { token } = await crearUsuarioPrueba('admin');

    const res = await request(app)
      .get('/api/ordenes/todas')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('ordenes');
  });

  it('debe rechazar si no es admin', async () => {
    const { token } = await crearUsuarioPrueba('cliente');

    const res = await request(app)
      .get('/api/ordenes/todas')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
  });
});