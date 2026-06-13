require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Sembrando datos de DavinchisMid...');

  await prisma.producto.createMany({
    data: [
      {
        nombre: 'Cochinita Pibil',
        descripcion: 'Cerdo marinado en achiote y naranja agria, cocinado en horno de tierra',
        precio: 120,
        categoria: 'plato fuerte',
        imagen: 'cochinita.jpg'
      },
      {
        nombre: 'Sopa de Lima',
        descripcion: 'Caldo de pollo con tiras de tortilla, lima yucateca y chile habanero',
        precio: 85,
        categoria: 'sopa',
        imagen: 'sopa-lima.jpg'
      },
      {
        nombre: 'Panuchos',
        descripcion: 'Tortillas fritas rellenas de frijol, con pavo, cebolla morada y aguacate',
        precio: 75,
        categoria: 'antojo',
        imagen: 'panuchos.jpg'
      },
      {
        nombre: 'Relleno Negro',
        descripcion: 'Guiso tradicional con chilmole, pavo y huevo cocido',
        precio: 130,
        categoria: 'plato fuerte',
        imagen: 'relleno-negro.jpg'
      },
      {
        nombre: 'Marquesitas',
        descripcion: 'Crêpe crujiente rellena de queso Edam y cajeta',
        precio: 45,
        categoria: 'postre',
        imagen: 'marquesitas.jpg'
      },
      {
        nombre: 'Kibis',
        descripcion: 'Croquetas de trigo con carne molida, típicas de Mérida',
        precio: 55,
        categoria: 'antojo',
        imagen: 'kibis.jpg'
      }
    ]
  });

  console.log('✅ Datos cargados correctamente');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());