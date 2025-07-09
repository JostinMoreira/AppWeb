import type { Usuario } from '../types/Usuario'

interface Props {
  usuarios: Usuario[]
  onEditar: (usuario: Usuario) => void
  onEliminar: (id: string) => void
}

export default function UsuarioList({ usuarios, onEditar, onEliminar }: Props) {
  return (
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Correo</th>
          <th>Rol</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {usuarios.map(usuario => (
          <tr key={usuario.id}>
            <td>{usuario.nombre}</td>
            <td>{usuario.correo}</td>
            <td>{usuario.rol}</td>
            <td>
              <button onClick={() => onEditar(usuario)}>Editar</button>
              <button onClick={() => onEliminar(usuario.id)}>Eliminar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
