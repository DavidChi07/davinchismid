import { createContext, useContext, useState } from 'react';

const CarritoContext = createContext();

export function CarritoProvider({ children }) {
  const [items, setItems] = useState([]);

  const agregar = (producto) => {
    setItems(prev => {
      const existe = prev.find(i => i.id === producto.id);
      if (existe) {
        return prev.map(i =>
          i.id === producto.id
            ? { ...i, cantidad: i.cantidad + 1 }
            : i
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const quitar = (id) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const cambiarCantidad = (id, cantidad) => {
    if (cantidad < 1) return quitar(id);
    setItems(prev =>
      prev.map(i => i.id === id ? { ...i, cantidad } : i)
    );
  };

  const vaciar = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.precio * i.cantidad, 0);
  const totalItems = items.reduce((sum, i) => sum + i.cantidad, 0);

  return (
    <CarritoContext.Provider value={{
      items, agregar, quitar, cambiarCantidad, vaciar, total, totalItems
    }}>
      {children}
    </CarritoContext.Provider>
  );
}

export const useCarrito = () => useContext(CarritoContext);