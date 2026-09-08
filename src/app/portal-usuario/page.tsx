'use client';

import React, { useState, useEffect } from 'react';
import Protected from '@/components/Protected';
import Navbar from '@/components/Navbar';
import TicketForm from '@/components/TicketForm';
import { useAuth } from '@/hooks/useAuth';
import { Plus, Ticket, CheckCircle2, Clock, AlertCircle, LogOut } from 'lucide-react';

export default function PortalUsuarioPage() {
  const { user, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [myTickets, setMyTickets] = useState<any[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(true);

  // Cargar únicamente los tickets del usuario logueado
  const loadMyTickets = async () => {
    if (!user?.id) return;
    try {
      setLoadingTickets(true);
      const { supabase } = await import('@/lib/supabaseClient');
      const { data, error } = await supabase
        .from('tickets')
        .select('id, code, title, type, priority, status, created_at')
        .eq('requester_id', user.id) // 🔒 Filtro de seguridad estricto
        .order('created_at', { ascending: false });

      if (error) console.error('Error cargando tus tickets:', error);
      else setMyTickets(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTickets(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadMyTickets();
    }
  }, [user?.id]);

  const handleTicketCreated = () => {
    setIsModalOpen(false);
    loadMyTickets(); // Recargar la lista local inmediatamente
  };

  return (
    <Protected allowedRoles={['usuario']}>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {/* Navbar Simplificada para Clientes */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center text-white font-bold">
                T
              </div>
              <span className="font-bold text-slate-800 text-lg">Centro de Soporte</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-700">{user?.name || user?.email}</p>
                <p className="text-xs text-slate-400 capitalize">Rol: {user?.role}</p>
              </div>
              <button 
                onClick={() => logout?.()}
                className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-50 transition-colors"
                title="Cerrar Sesión"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* Contenido Principal */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
          
          {/* Banner de Bienvenida */}
          <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">¡Hola! ¿Cómo podemos ayudarte hoy?</h1>
              <p className="text-cyan-100 mt-2 text-sm sm:text-base">
                Reporta fallas técnicas o solicita nuevos requerimientos de software de forma rápida.
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 bg-white hover:bg-cyan-50 text-cyan-700 font-semibold px-5 py-3 rounded-xl shadow-sm transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus size={18} /> Crear una Solicitud
            </button>
          </div>

          {/* Listado de mis Solicitudes */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-6">
              <Ticket className="text-cyan-600" size={20} />
              <h2 className="font-bold text-slate-800 text-lg">El Estado de tus Reportes</h2>
            </div>

            {loadingTickets ? (
              <div className="text-center py-12 text-slate-400 text-sm animate-pulse">
                Cargando tu historial de tickets...
              </div>
            ) : myTickets.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-xl">
                <AlertCircle className="mx-auto text-slate-300 mb-3" size={36} />
                <p className="text-slate-600 font-medium">Aún no tienes ningún ticket registrado.</p>
                <p className="text-slate-400 text-xs mt-1">Si necesitas asistencia, haz clic en "Crear una Solicitud".</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-xs border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4 font-semibold">Código</th>
                      <th className="py-3 px-4 font-semibold">Asunto</th>
                      <th className="py-3 px-4 font-semibold">Tipo</th>
                      <th className="py-3 px-4 font-semibold">Prioridad</th>
                      <th className="py-3 px-4 font-semibold">Estado Actual</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {myTickets.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4 font-medium text-slate-900">
                          {t.code || `${t.id.substring(0, 8)}...`}
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-700">{t.title}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                            t.type === 'Incident' ? 'bg-amber-50 text-amber-700' : 'bg-indigo-50 text-indigo-700'
                          }`}>
                            {t.type === 'Incident' ? 'Incidente' : 'Requerimiento'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-500">{t.priority}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            t.status === 'Closed' ? 'bg-slate-100 text-slate-600 line-through' :
                            t.status === 'Inprog' ? 'bg-blue-50 text-blue-700' :
                            t.status === 'Pending' ? 'bg-amber-50 text-amber-700' :
                            'bg-emerald-50 text-emerald-700'
                          }`}>
                            {t.status === 'Open' ? 'Abierto' :
                             t.status === 'Inprog' ? 'En Progreso' :
                             t.status === 'Pending' ? 'Pendiente' : 'Cerrado'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>

        {/* Modal con el formulario */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-fade-in">
            <div className="w-full max-w-2xl bg-white rounded-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6 pb-2 border-b border-slate-100">
                <h2 className="font-bold text-xl text-slate-800">Nueva Solicitud de Soporte</h2>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="text-slate-400 hover:text-slate-600 font-medium text-sm transition-colors"
                >
                  Cerrar
                </button>
              </div>
              <TicketForm userId={user?.id || ''} slas={[]} onSubmitSuccess={handleTicketCreated} />
            </div>
          </div>
        )}
      </div>
    </Protected>
  );
}