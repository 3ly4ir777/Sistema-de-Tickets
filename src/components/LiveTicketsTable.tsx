'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle, Clock, AlertTriangle } from 'lucide-react';

export default function LiveTicketsTable() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const { supabase } = await import('@/lib/supabaseClient');
        const { data, error } = await supabase
          .from('tickets')
          .select('id, code, title, type, priority, status, assignee_id')
          .order('created_at', { ascending: false })
          .limit(100);

        if (!cancelled) {
          if (error) {
            console.error('Error fetching tickets', error);
          } else {
            setTickets(data || []);
          }
        }
      } catch (err) {
        console.error('Exception loading tickets', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col lg:col-span-2">
      <h3 className="font-bold text-slate-800 text-base mb-4 flex items-center gap-2">
        <CheckCircle className="text-green-600" size={18} />
        Monitoreo Reciente de Tickets Activos
      </h3>
      <div className="overflow-x-auto flex-1">
        {loading ? (
          <div className="text-slate-500">Cargando tickets...</div>
        ) : (
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase text-xs border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">ID</th>
                <th className="py-3 px-4 font-semibold">Tipo</th>
                <th className="py-3 px-4 font-semibold">Asunto</th>
                <th className="py-3 px-4 font-semibold">Prioridad</th>
                <th className="py-3 px-4 font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tickets.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/80 transition-colors cursor-pointer">
                  <td className="py-3 px-4 font-medium text-slate-900">{t.code || t.id}</td>
                  <td className="py-3 px-4"><span className="px-2 py-0.5 text-xs bg-indigo-50 text-indigo-700 rounded-full font-medium">{t.type}</span></td>
                  <td className="py-3 px-4 text-slate-500">{t.title}</td>
                  <td className="py-3 px-4"><span className="text-red-600 font-semibold">{t.priority}</span></td>
                  <td className="py-3 px-4"><span className="inline-flex items-center gap-1.5 text-emerald-600 font-medium"><Clock size={14}/> {t.status || 'N/A'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}