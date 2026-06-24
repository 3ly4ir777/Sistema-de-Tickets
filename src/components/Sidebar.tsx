import React from 'react';
import { LayoutDashboard, Ticket, Users, Settings } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between hidden md:flex shrink-0">
      <div>
        <div className="p-6 text-xl font-bold tracking-wider border-b border-slate-800 flex items-center gap-3">
          <Ticket className="text-cyan-400" />
          <span>SLA Dashboard</span>
        </div>
        <nav className="p-4 space-y-2">
          <a href="#" className="flex items-center gap-4 px-4 py-3 bg-cyan-600 text-white rounded-lg transition-colors">
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </a>
          <a href="/tickets" className="flex items-center gap-4 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
            <Ticket size={20} />
            <span className="font-medium">Tickets</span>
          </a>
          <a href="/usuarios" className="flex items-center gap-4 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
            <Users size={20} />
            <span className="font-medium">Clientes</span>
          </a>
           <a href="/slas" className="flex items-center gap-4 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
            <Users size={20} />
            <span className="font-medium">SLAs</span>
          </a>
          <a href="/reportes" className="flex items-center gap-4 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
            <LayoutDashboard size={20} />
            <span className="font-medium">Reportes</span>
          </a>
          
          <a href="/configuracion" className="flex items-center gap-4 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
            <Settings size={20} />
            <span className="font-medium">Configuración</span>
          </a>
          
        </nav>
      </div>
      <div className="p-4 border-t border-slate-800 text-sm text-slate-500 text-center">
        SLA Manager v1.0
      </div>
    </aside>
  );
}