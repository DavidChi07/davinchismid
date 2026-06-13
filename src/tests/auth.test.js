require('dotenv').config();
const request = require('supertest');
const app = require('../app');
const { limpiarDB } = require('./helpers');

beforeEach(async () => await limpiarDB());

describe('POST /api/auth/registro', () => {
  it('debe registrar un usuario correctamente', async () => {
    const res = await request(app)
      .post('/api/auth/registro')
      .send({
        nombre: 'David Chi',
        email: 'david@test.com',
        password: '123456'
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.usuario.email).toBe('david@test.com');
    expect(res.body.usuario.rol).toBe('cliente');
  });

  it('debe rechazar un email duplicado', async () => {
    await request(app)
      .post('/api/auth/registro')
      .send({ nombre: 'David', email: 'david@test.com', password: '123456' });

    const res = await request(app)
      .post('/api/auth/registro')
      .send({ nombre: 'David 2', email: 'david@test.com', password: '123456' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/ya está registrado/i);
  });

  it('debe rechazar datos inválidos', async () => {
    const res = await request(app)
      .post('/api/auth/registro')
      .send({ nombre: 'Da', email: 'no-es-email', password: '123' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('detalles');
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await request(app)
      .post('/api/auth/registro')
      .send({ nombre: 'David', email: 'david@test.com', password: '123456' });
  });

  it('debe hacer login correctamente', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'david@test.com', password: '123456' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('debe rechazar contraseña incorrecta', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'david@test.com', password: 'incorrecta' });

    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/credenciales inválidas/i);
  });

  it('debe rechazar usuario inexistente', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'noexiste@test.com', password: '123456' });

    expect(res.status).toBe(401);
  });
});