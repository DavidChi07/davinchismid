import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CarritoProvider } from './context/CarritoContext';
import Navbar from './components/Navbar';
import Inicio from './pages/Inicio';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Carrito from './pages/Carrito';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CarritoProvider>
          <Navbar />
          <Routes>
            <Route path="/"         element={<Inicio />} />
            <Route path="/login"    element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/carrito"  element={<Carrito />} />
          </Routes>
        </CarritoProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}