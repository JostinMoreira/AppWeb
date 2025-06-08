import React, { useState } from "react";
import type { Post } from "../types";

interface PostCardProps {
  post: Post;
  currentUserId: string | null;
  onVote: (postId: string) => void;
  onCommentSubmit: (postId: string, comment: string) => void;
  onResponseSubmit: (postId: string, response: string) => void;
  isAuthority: boolean;
}

export default function PostCard({
  post,
  currentUserId,
  onVote,
  onCommentSubmit,
  onResponseSubmit,
  isAuthority,
}: PostCardProps) {
  const [commentText, setCommentText] = useState("");
  const [responseText, setResponseText] = useState("");

  const userHasVoted = currentUserId ? post.votes.includes(currentUserId) : false;

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim().length < 3) {
      alert("El comentario debe tener al menos 3 caracteres.");
      return;
    }
    onCommentSubmit(post.id, commentText.trim());
    setCommentText("");
  };

  const handleResponseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (responseText.trim().length < 5) {
      alert("La respuesta debe tener al menos 5 caracteres.");
      return;
    }
    onResponseSubmit(post.id, responseText.trim());
    setResponseText("");
  };

  return (
    <article className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
      <header className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              post.type === 'queja' ? 'bg-red-100 text-red-700' :
              post.type === 'sugerencia' ? 'bg-blue-100 text-blue-700' :
              post.type === 'propuesta' ? 'bg-green-100 text-green-700' :
              'bg-slate-100 text-slate-700'
            }`}>
              {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
            </span>
            <span className="text-xs text-slate-500">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">{post.title}</h3>
        </div>
      </header>
      
      <p className="text-slate-700 whitespace-pre-line mb-4 leading-relaxed">{post.content}</p>
      
      <div className="flex items-center justify-between text-sm text-slate-500 mb-4 pb-4 border-b border-slate-100">
        <span>
          Por <strong className="text-slate-700">{post.authorEmail}</strong>
        </span>
        <span>{new Date(post.createdAt).toLocaleTimeString()}</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => onVote(post.id)}
          className={`flex items-center gap-2 py-2 px-4 rounded-xl font-medium transition-all ${
            userHasVoted 
              ? "bg-slate-700 text-white shadow-md" 
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
          aria-pressed={userHasVoted}
          aria-label={userHasVoted ? "Quitar voto" : "Votar esta iniciativa"}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          {userHasVoted ? "Votado" : "Votar"} ({post.votes.length})
        </button>
        
        <div className="text-sm text-slate-500">
          {post.comments.length} comentario{post.comments.length !== 1 ? 's' : ''}
        </div>
      </div>

      <section>
        <h4 className="text-lg font-semibold text-slate-800 mb-3">Comentarios</h4>
        <div className="max-h-48 overflow-y-auto mb-4 space-y-3">
          {post.comments.length === 0 && (
            <p className="text-slate-500 italic text-center py-4">No hay comentarios aún.</p>
          )}
          {post.comments.map((c) => (
            <div
              key={c.id}
              className="bg-slate-50 rounded-xl p-3 border border-slate-100"
              aria-label={`Comentario de ${c.authorEmail}`}
            >
              <div className="flex items-center justify-between mb-1">
                <strong className="text-slate-700 text-sm">{c.authorEmail}</strong>
                <span className="text-xs text-slate-500">
                  {new Date(c.createdAt).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-slate-700">{c.comment}</p>
            </div>
          ))}
        </div>

        {currentUserId ? (
          <form onSubmit={handleCommentSubmit} className="flex gap-3">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Escribe un comentario..."
              className="flex-grow p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-slate-50 focus:bg-white transition"
              aria-label="Nuevo comentario"
              required
              minLength={3}
            />
            <button
              type="submit"
              className="bg-slate-700 hover:bg-slate-800 text-white px-6 rounded-xl font-medium transition-colors"
            >
              Comentar
            </button>
          </form>
        ) : (
          <p className="text-slate-500 italic text-center py-2">Inicia sesión para comentar.</p>
        )}
      </section>

      {isAuthority && (
        <section className="mt-6 pt-6 border-t border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Respuesta institucional
          </h4>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
            {post.institutionalResponse ? (
              <p className="text-slate-700 whitespace-pre-line">{post.institutionalResponse}</p>
            ) : (
              <p className="text-slate-500 italic">Aún no hay respuesta institucional.</p>
            )}
          </div>

          <form onSubmit={handleResponseSubmit} className="flex gap-3">
            <input
              type="text"
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder="Escribe una respuesta institucional..."
              className="flex-grow p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 focus:bg-white transition"
              aria-label="Nueva respuesta institucional"
              required
              minLength={5}
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-xl font-medium transition-colors"
            >
              Responder
            </button>
          </form>
        </section>
      )}
    </article>
  );
}
