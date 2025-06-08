import React, { useState } from "react";

interface NewPostFormProps {
  onSubmit: (title: string, type: string, content: string) => void;
}

export default function NewPostForm({ onSubmit }: NewPostFormProps) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("idea");
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim().length < 5 || content.trim().length < 10) {
      alert("El título debe tener al menos 5 caracteres y la descripción al menos 10.");
      return;
    }
    onSubmit(title.trim(), type, content.trim());
    setTitle("");
    setType("idea");
    setContent("");
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-800">Nueva publicación</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="title">
            Título de tu publicación
          </label>
          <input
            id="title"
            type="text"
            placeholder="Ej: Mejorar accesos a la biblioteca"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            minLength={5}
            maxLength={100}
            className="w-full p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-slate-50 focus:bg-white transition"
            autoComplete="off"
          />
          <p className="text-xs text-slate-500 mt-1">{title.length}/100 caracteres</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="type">
            Tipo de publicación
          </label>
          <select
            id="type"
            value={type}
            onChange={e => setType(e.target.value)}
            className="w-full p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-slate-50 focus:bg-white transition"
          >
            <option value="idea">💡 Idea</option>
            <option value="queja">⚠️ Queja</option>
            <option value="propuesta">📋 Propuesta</option>
            <option value="sugerencia">💭 Sugerencia</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="content">
            Descripción detallada
          </label>
          <textarea
            id="content"
            rows={5}
            placeholder="Describe tu iniciativa aquí. Sé específico y constructivo..."
            value={content}
            onChange={e => setContent(e.target.value)}
            required
            minLength={10}
            maxLength={500}
            className="w-full p-4 rounded-xl border border-slate-300 resize-y focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-slate-50 focus:bg-white transition"
          />
          <p className="text-xs text-slate-500 mt-1">{content.length}/500 caracteres</p>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-slate-700 to-slate-800 text-white py-4 rounded-xl font-semibold hover:from-slate-800 hover:to-slate-900 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Publicar iniciativa
        </button>
      </form>
    </div>
  );
}