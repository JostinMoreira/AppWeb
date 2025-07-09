import { useNavigate } from 'react-router-dom'

export default function BotonVolver() {
  const navegar = useNavigate()
  return (
    <button onClick={() => navegar(-1)} style={{ marginBottom: 16 }}>
      ← Volver
    </button>
  )
}