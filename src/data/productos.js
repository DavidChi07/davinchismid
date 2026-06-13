// src/data/productos.js
const productos = [
  {
    id: 1,
    nombre: 'Cochinita Pibil',
    descripcion: 'Cerdo marinado en achiote y naranja agria, cocinado en horno de tierra',
    precio: 120,
    categoria: 'plato fuerte',
    disponible: true,
    imagen: 'cochinita.jpg'
  },
  {
    id: 2,
    nombre: 'Sopa de Lima',
    descripcion: 'Caldo de pollo con tiras de tortilla, lima yucateca y chile habanero',
    precio: 85,
    categoria: 'sopa',
    disponible: true,
    imagen: 'sopa-lima.jpg'
  },
  {
    id: 3,
    nombre: 'Panuchos',
    descripcion: 'Tortillas fritas rellenas de frijol, con pavo, cebolla morada y aguacate',
    precio: 75,
    categoria: 'antojo',
    disponible: true,
    imagen: 'panuchos.jpg'
  },
  {
    id: 4,
    nombre: 'Relleno Negro',
    descripcion: 'Guiso tradicional con chilmole, pavo y huevo cocido',
    precio: 130,
    categoria: 'plato fuerte',
    disponible: true,
    imagen: 'relleno-negro.jpg'
  },
  {
    id: 5,
    nombre: 'Marquesitas',
    descripcion: 'Crêpe crujiente rellena de queso Edam y cajeta',
    precio: 45,
    categoria: 'postre',
    disponible: true,
    imagen: 'marquesitas.jpg'
  },
  {
    id: 6,
    nombre: 'Poc Chuc',
    descripcion: 'Cerdo asado marinado en naranja agria con cebolla morada',
    precio: 115,
    categoria: 'plato fuerte',
    disponible: false,
    imagen: 'poc-chuc.jpg'
  }
];

module.exports = productos;