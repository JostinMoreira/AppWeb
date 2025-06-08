import React, { useState } from "react";

interface PerfilUsuarioProps {
  initialData: {
    nombres: string;
    celular: string;
    ciudad: string;
    nacionalidad: string;
    facultad: string;
    carrera: string;
    nivel: string;
    edad: number;
  };
  onBack: () => void;
  onSave: (data: any) => void;
}

const facultades = [
  "Ingeniería",
  "Ciencias de la Salud",
  "Ciencias Administrativas",
  "Educación",
  "Jurídicas",
  "Arquitectura",
  "Otra"
];

export default function PerfilUsuario({ initialData, onBack, onSave }: PerfilUsuarioProps) {
  const [form, setForm] = useState(initialData);
  const [editMode, setEditMode] = useState(
    !initialData.nombres && !initialData.celular && !initialData.ciudad && !initialData.nacionalidad && !initialData.facultad && !initialData.carrera && !initialData.nivel && !initialData.edad
  );
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === "edad" ? Number(value) : value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.edad < 16) {
      setError("La edad debe ser mayor o igual a 16 años.");
      return;
    }
    setError("");
    onSave(form);
    setEditMode(false);
  }

  if (!editMode) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-10 px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-2xl w-full p-8">
          {/* Header */}
          <div className="text-center mb-2">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Mi Perfil</h2>
            <p className="text-slate-600">Información personal y académica</p>
          </div>

          {/* Información del perfil */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <PerfilDato label="Nombres completos: " value={form.nombres} icon="" />
            <PerfilDato label="Teléfono: " value={form.celular} icon="" />
            <PerfilDato label="Ciudad: " value={form.ciudad} icon="" />
            <PerfilDato label="Nacionalidad: " value={form.nacionalidad} icon="" />
            <PerfilDato label="Facultad: " value={form.facultad} icon="" />
            <PerfilDato label="Carrera: " value={form.carrera} icon="" />
            <PerfilDato label="Nivel académico: " value={form.nivel} icon="" />
            <PerfilDato label="Edad: " value={form.edad && form.edad > 0 ? `${form.edad} años` : ""} icon="" />
          </div>

          {/* Botones */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 px-6 rounded-xl transition-colors"
            >
              Volver al inicio
            </button>
            <button
              type="button"
              onClick={() => setEditMode(true)}
              className="flex-1 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200"
            >
              Editar perfil
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center py-10 px-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Editar Perfil</h2>
          <p className="text-slate-600">Actualiza tu información personal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Nombres completos</label>
            <input
              type="text"
              name="nombres"
              value={form.nombres}
              onChange={handleChange}
              required
              className="w-full p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-slate-50 focus:bg-white transition"
              placeholder="Ingresa tus nombres completos"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Teléfono</label>
            <input
              type="tel"
              name="celular"
              value={form.celular}
              onChange={handleChange}
              required
              className="w-full p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-slate-50 focus:bg-white transition"
              placeholder="Ej: 0987654321"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Ciudad</label>
            <input
              type="text"
              name="ciudad"
              value={form.ciudad}
              onChange={handleChange}
              required
              className="w-full p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-slate-50 focus:bg-white transition"
              placeholder="Ej: Manta"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Nacionalidad</label>
            <input
              type="text"
              name="nacionalidad"
              value={form.nacionalidad}
              onChange={handleChange}
              required
              className="w-full p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-slate-50 focus:bg-white transition"
              placeholder="Ej: Ecuatoriana"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Facultad</label>
            <select
              name="facultad"
              value={form.facultad}
              onChange={handleChange}
              required
              className="w-full p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-slate-50 focus:bg-white transition"
            >
              <option value="">Selecciona una facultad</option>
              {facultades.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Carrera</label>
            <input
              type="text"
              name="carrera"
              value={form.carrera}
              onChange={handleChange}
              required
              className="w-full p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-slate-50 focus:bg-white transition"
              placeholder="Ej: Ingeniería en Sistemas"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Nivel académico</label>
            <input
              type="text"
              name="nivel"
              value={form.nivel}
              onChange={handleChange}
              required
              className="w-full p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-slate-50 focus:bg-white transition"
              placeholder="Ej: 5to semestre"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Edad</label>
            <input
              type="number"
              name="edad"
              value={form.edad}
              onChange={handleChange}
              required
              min={16}
              className="w-full p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-slate-50 focus:bg-white transition"
              placeholder="Ej: 20"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => { setEditMode(false); setError(""); }}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 px-6 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PerfilDato({ label, value, icon }: { label: string; value: string; icon: string }) {
  const mostrar = value && value !== "0" ? value : <span className='text-slate-400 italic'>Sin especificar</span>;
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 hover:bg-slate-100 transition-colors">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{icon}</span>
        <span className="text-xs font-medium text-slate-600 uppercase tracking-wide">{label}</span>
      </div>
      <div className="text-slate-800 font-medium">{mostrar}</div>
    </div>
  );
}