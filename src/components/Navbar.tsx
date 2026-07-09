import React from 'react';
import { Search, Bell, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 sticky top-0 z-10 shrink-0">
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Buscar tickets o códigos de resolución..." 
          className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-cyan-500 transition-colors"
        />
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors" title="Notificaciones">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="h-8 w-px bg-slate-200"></div>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-cyan-600 flex items-center justify-center font-bold text-white text-sm">
            {user?.name ? user.name.slice(0,2).toUpperCase() : 'OP'}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-700 leading-none">{user?.name || 'Usuario'}</p>
            <span className="text-xs text-slate-400">{user?.role || '—'}</span>
          </div>
          <button onClick={() => logout()} title="Cerrar sesión" className="ml-3 p-2 rounded-md text-slate-600 hover:bg-slate-100">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}