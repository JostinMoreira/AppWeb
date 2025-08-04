import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuth from './hooks/useAuth'; // Importamos el hook que maneja la lógica

// Importación de tus componentes de página
import IniciarSesion from './pages/IniciarSesion';
import Registro from './pages/Registro';
import Inicio from './pages/Inicio';
import PerfilUsuario from './pages/PerfilUsuario';
import EditarPerfil from './pages/EditarPerfil';
import UsuariosPage from './pages/UsuariosPage';

function App() {
  // Usamos el hook para obtener el estado del usuario y de la carga
  const { user, loading } = useAuth();

  // Mostramos un mensaje de carga mientras se verifica la sesión de Firebase
  if (loading) {
    return <div>Cargando sesión...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas: accesibles siempre */}
        <Route path="/iniciar-sesion" element={<IniciarSesion />} />
        <Route path="/registro" element={<Registro />} />

        {/* Rutas Privadas: usamos una expresión ternaria para protegerlas.
            Si el 'user' existe, se muestra el componente. Si no, se redirige a iniciar sesión.
        */}
        <Route path="/inicio" element={user ? <Inicio /> : <Navigate to="/iniciar-sesion" />} />
        <Route path="/perfil" element={user ? <PerfilUsuario /> : <Navigate to="/iniciar-sesion" />} />
        <Route path="/editar-perfil" element={user ? <EditarPerfil /> : <Navigate to="/iniciar-sesion" />} />
        <Route path="/usuarios" element={user ? <UsuariosPage /> : <Navigate to="/iniciar-sesion" />} />

        {/* Ruta raíz: si el usuario está logueado, va a inicio. Si no, a iniciar sesión. */}
        <Route path="/" element={user ? <Navigate to="/inicio" /> : <Navigate to="/iniciar-sesion" />} />

        {/* Ruta para páginas no encontradas */}
        <Route path="*" element={<p>Página no encontrada</p>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
