import React from "react";
import type { User } from "firebase/auth";

interface HeaderProps {
  user: User | null;
  userEmail: string | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onProfileClick?: () => void;
  isProfile?: boolean;
  onBackProfile?: () => void;
}

export default function Header({ user, userEmail, onLoginClick, onLogoutClick, onProfileClick, isProfile, onBackProfile }: HeaderProps) {
  return (
    <header className="sticky top-0 bg-white/95 backdrop-blur-sm shadow-sm border-b border-slate-200 z-30 w-full">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {isProfile ? (
            <>
              <button
                onClick={onBackProfile}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
                type="button"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Volver
              </button>
              <h1 className="text-2xl font-bold text-slate-800">Perfil de Usuario</h1>
              <div className="w-20"></div> {/* Spacer */}
            </>
          ) : (
            <>
              {/* User Actions */}
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="text-right mr-4">
                    <p className="text-xs text-slate-500">Conectado</p>
                  </div>
                  <button
                    onClick={onProfileClick}
                    className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 px-4 rounded-xl transition-colors"
                    type="button"
                  >
                    <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Mi Perfil
                  </button>
                  <button
                    onClick={onLogoutClick}
                    className="flex items-center gap-2 bg-slate-700 hover:bg-slate-800 text-white font-medium py-2 px-4 rounded-xl transition-colors"
                  >
                    <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Cerrar Sesion
                  </button>
                </div>
              ) : (
                <p>
                  Bienvenido 
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}