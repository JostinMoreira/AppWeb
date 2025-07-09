import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProveedorAutenticacion } from './context/ContextoAutenticacion'
import IniciarSesion from './pages/IniciarSesion'
import Registro from './pages/Registro'
import Inicio from './pages/Inicio'
import { RutaPrivada } from './components/RutaPrivada'
import PerfilUsuario from './pages/PerfilUsuario'
import EditarPerfil from './pages/EditarPerfil'
import UsuariosPage from './pages/UsuariosPage'


function App() {
  return (
    <ProveedorAutenticacion>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/inicio" />} />
          <Route path="/iniciar-sesion" element={<IniciarSesion />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/inicio" element={
            <RutaPrivada>
              <Inicio />
            </RutaPrivada>
          } />
          <Route path="/perfil" element={
            <RutaPrivada>
              <PerfilUsuario />
            </RutaPrivada>
          } />
          <Route path="*" element={<p>Página no encontrada</p>} />
          <Route path="/editar-perfil" element={
            <RutaPrivada>
              <EditarPerfil />
            </RutaPrivada>
          } />
          <Route path="/usuarios" element={
            <RutaPrivada>
              <UsuariosPage />
            </RutaPrivada>
          } />
        </Routes>
      </BrowserRouter>
    </ProveedorAutenticacion>
  )
}

export default App
