import React from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { Shield, UserPlus, Mail, ShieldAlert } from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'administrador' | 'encargado_sistemas' | 'usuario';
  activeTicketsCount: number;
}

const mockUsers: UserProfile[] = [
  { id: '1', name: 'Ana Martínez', email: 'ana.m@empresa.com', role: 'administrador', activeTicketsCount: 0 },
  { id: '2', name: 'Carlos Mendoza', email: 'carlos.sistemas@empresa.com', role: 'encargado_sistemas', activeTicketsCount: 4 },
  { id: '3', name: 'Juan Pérez', email: 'juan.perez@cliente.com', role: 'usuario', activeTicketsCount: 1 }
];

export default function UsuariosPage() {
  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Navbar />
        <main className="p-6 max-w-[1600px] w-full mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Control de Usuarios y Roles</h1>
              <p className="text-sm text-slate-500">Asigna permisos y gestiona los accesos del personal.</p>
            </div>
            <button className="inline-flex items-center gap-2 bg-[#1d2d5b] hover:bg-slate-800 text-white text-sm font-medium px-4 py-2.5 rounded-lg shadow-sm transition-colors">
              <UserPlus size={16} /> Invitar Miembro
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockUsers.map((user) => (
              <div key={user.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold uppercase px-2 py-1 rounded-md ${
                      user.role === 'administrador' ? 'bg-red-50 text-red-700 border border-red-200' :
                      user.role === 'encargado_sistemas' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {user.role.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">ID: #{user.id}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">{user.name}</h3>
                    <p className="text-sm text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <Mail size={14} /> {user.email}
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-100 mt-4 pt-3 flex justify-between items-center text-sm">
                  <span className="text-slate-500">Tickets Activos: <strong className="text-slate-800">{user.activeTicketsCount}</strong></span>
                  <button className="text-xs font-semibold text-cyan-600 hover:text-cyan-700">
                    Editar Perfil &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}