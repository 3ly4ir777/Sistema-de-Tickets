'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { CheckCircle, Clock, Loader2, Search, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';

export default function LiveTicketsTable() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🎛️ Estados para filtros, búsqueda y paginación
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos los Estados');
  const [priorityFilter, setPriorityFilter] = useState('Todas las Prioridades');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Cantidad de tickets por página

  useEffect(() => {
    let cancelled = false;
    let subscription: any = null;

    // 1. Carga inicial asíncrona
    async function loadTickets() {
      try {
        const { supabase } = await import('@/lib/supabaseClient');
        const { data, error } = await supabase
          .from('tickets')
          .select('id, code, title, type, priority, status, assignee_id, created_at')
          .order('created_at', { ascending: false })
          .limit(200); // Ampliamos un poco el límite para dar más margen al buscador y paginador

        if (!cancelled) {
          if (error) {
            console.error('Error fetching tickets', error);
          } else {
            setTickets(data || []);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error('Exception loading tickets', err);
        if (!cancelled) setLoading(false);
      }
    }

    // 2. Suscripción síncrona al canal de Realtime
    async function initRealtime() {
      try {
        const { supabase } = await import('@/lib/supabaseClient');
        
        if (cancelled) return;

        subscription = supabase
          .channel('public:tickets_changes')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'tickets' },
            (payload: { eventType: string; new: any; old: any }) => {
              if (cancelled) return;

              if (payload.eventType === 'INSERT') {
                setTickets((prevTickets) => [payload.new, ...prevTickets]);
              }

              if (payload.eventType === 'UPDATE') {
                setTickets((prevTickets) =>
                  prevTickets.map((t) => (t.id === payload.new.id ? payload.new : t))
                );
              }

              if (payload.eventType === 'DELETE') {
                setTickets((prevTickets) =>
                  prevTickets.filter((t) => t.id !== payload.old.id)
                );
              }
            }
          )
          .subscribe();
      } catch (err) {
        console.error('Error inicializando Realtime:', err);
      }
    }

    loadTickets();
    initRealtime();

    return () => {
      cancelled = true;
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  // ==========================================
  // 🔍 MOTOR DE FILTRADO Y BÚSQUEDA (useMemo)
  // ==========================================
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      // 1. Filtro por término de búsqueda (Busca en título o código)
      const matchesSearch = 
        (ticket.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (ticket.code?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (ticket.id?.toLowerCase() || '').includes(searchTerm.toLowerCase());

      // 2. Filtro por Estado (Mapeado a los enums reales de tu DB: Open, Inprog, Pending, Closed)
      let matchesStatus = true;
      if (statusFilter === 'Abiertos') matchesStatus = ticket.status === 'Open';
      if (statusFilter === 'En Progreso') matchesStatus = ticket.status === 'Inprog' || ticket.status === 'Pending';
      if (statusFilter === 'Cerrados') matchesStatus = ticket.status === 'Closed';

      // 3. Filtro por Prioridad (Mapeado a los enums reales de tu DB: P1, P2)
      let matchesPriority = true;
      if (priorityFilter === 'P1 - Alta') matchesPriority = ticket.priority === 'P1';
      if (priorityFilter === 'P2 - Estándar') matchesPriority = ticket.priority === 'P2';

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tickets, searchTerm, statusFilter, priorityFilter]);

  // ==========================================
  // 📑 LOGICA DE PAGINACIÓN
  // ==========================================
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage) || 1;
  
  // Resetear a la página 1 si los filtros reducen los resultados drásticamente
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, priorityFilter]);

  const paginatedTickets = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTickets.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTickets, currentPage]);

  return (
    <div className="space-y-4">
      {/* 🛠️ Barra de Herramientas: Buscador y Filtros integrados */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        
        {/* Buscador */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por asunto, código o ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-sm pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-slate-50 focus:bg-white transition-all text-slate-700"
          />
        </div>

        {/* selectores de Filtros */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
            <SlidersHorizontal size={14} /> Filtros:
          </span>
          
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer shadow-sm"
          >
            <option>Todos los Estados</option>
            <option>Abiertos</option>
            <option>En Progreso</option>
            <option>Cerrados</option>
          </select>

          <select 
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer shadow-sm"
          >
            <option>Todas las Prioridades</option>
            <option>P1 - Alta</option>
            <option>P2 - Estándar</option>
          </select>
        </div>
      </div>

      {/* 📊 Tabla Principal */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col">
        <h3 className="font-bold text-slate-800 text-base mb-4 flex items-center gap-2">
          <CheckCircle className="text-green-600" size={18} />
          Monitoreo Reciente de Tickets Activos
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" title="Conexión en vivo" />
        </h3>
        
        <div className="overflow-x-auto flex-1">
          {loading ? (
            <div className="flex items-center gap-2 text-slate-500 py-12 justify-center">
              <Loader2 className="animate-spin text-cyan-500" size={20} />
              Cargando buzón en tiempo real...
            </div>
          ) : (
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase text-xs border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">ID / Código</th>
                  <th className="py-3 px-4 font-semibold">Tipo</th>
                  <th className="py-3 px-4 font-semibold">Asunto</th>
                  <th className="py-3 px-4 font-semibold">Prioridad</th>
                  <th className="py-3 px-4 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedTickets.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      No se encontraron tickets que coincidan con la búsqueda o filtros.
                    </td>
                  </tr>
                ) : (
                  paginatedTickets.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition-colors cursor-pointer group">
                      <td className="py-3 px-4 font-medium text-slate-900 group-hover:text-cyan-600 transition-colors">
                        {t.code || (t.id ? `${t.id.substring(0, 8)}...` : 'N/A')}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                          t.type === 'Incident' ? 'bg-amber-50 text-amber-700' : 'bg-indigo-50 text-indigo-700'
                        }`}>
                          {t.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 truncate max-w-xs">{t.title}</td>
                      <td className="py-3 px-4">
                        <span className={`font-semibold ${t.priority === 'P1' ? 'text-red-600' : 'text-slate-500'}`}>
                          {t.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1.5 font-medium px-2.5 py-0.5 rounded-full text-xs ${
                          t.status === 'Closed' ? 'bg-slate-100 text-slate-500 line-through' :
                          t.status === 'Inprog' ? 'bg-blue-50 text-blue-700' :
                          t.status === 'Pending' ? 'bg-amber-50 text-amber-700' :
                          'bg-emerald-50 text-emerald-700'
                        }`}>
                          <Clock size={12} /> 
                          {t.status === 'Open' ? 'Abierto' : 
                           t.status === 'Inprog' ? 'En Progreso' : 
                           t.status === 'Pending' ? 'Pendiente' : 
                           t.status === 'Closed' ? 'Cerrado' : t.status || 'Abierto'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* 📑 Paginador Visual Estilizado */}
        {!loading && filteredTickets.length > 0 && (
          <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-4 text-sm text-slate-500">
            <div>
              Mostrando <span className="font-medium text-slate-700">{Math.min((currentPage - 1) * itemsPerPage + 1, filteredTickets.length)}</span> a{' '}
              <span className="font-medium text-slate-700">{Math.min(currentPage * itemsPerPage, filteredTickets.length)}</span> de{' '}
              <span className="font-medium text-slate-700">{filteredTickets.length}</span> tickets
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 enabled:hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs text-slate-600 font-medium px-2">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 enabled:hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}