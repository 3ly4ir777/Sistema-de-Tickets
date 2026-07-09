'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { ShieldCheck, Clock, Settings2 } from 'lucide-react';
import Protected from '@/components/Protected';

interface SLAPolicy {
  id: number;
  name: string;
  target_response_seconds: number;
  target_resolution_seconds: number;
}

export default function SlasPage() {
  const [slas, setSlas] = useState<SLAPolicy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const { supabase } = await import('@/lib/supabaseClient');
        const { data, error } = await supabase.from('slas').select('*').order('id');
        if (!cancelled) {
          if (error) console.error('Error fetching SLAs', error);
          else setSlas(data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <Protected>
      <div className="flex h-screen bg-slate-100 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-y-auto">
          <Navbar />
          <main className="p-6 max-w-[1600px] w-full mx-auto space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Políticas de Acuerdo de Nivel de Servicio (SLA)</h1>
              <p className="text-sm text-slate-500">Mide y edita los umbrales de tiempos comprometidos para la resolución de soporte.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {loading ? <div>Cargando SLAs...</div> : slas.map((policy) => (
                <div key={policy.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                  <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-50 text-[#1d2d5b] rounded-lg">
                        <ShieldCheck size={20} />
                      </div>
                      <h3 className="font-bold text-slate-800 text-lg">{(policy as any).name}</h3>
                    </div>
                    <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-50">
                      <Settings2 size={16} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-slate-50 p-3 rounded-lg flex items-center gap-3">
                      <Clock size={18} className="text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-400 uppercase font-semibold leading-none">Meta de Respuesta</p>
                        <p className="font-bold text-slate-700 mt-1">{Math.floor(policy.target_response_seconds/60)} Minutos</p>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg flex items-center gap-3">
                      <Clock size={18} className="text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-400 uppercase font-semibold leading-none">Meta de Solución</p>
                        <p className="font-bold text-slate-700 mt-1">{Math.floor(policy.target_resolution_seconds/3600)} Horas</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-between items-center text-sm">
                    <span className="text-slate-500">Cumplimiento Histórico:</span>
                    <span className="text-emerald-600 font-extrabold text-lg">—</span>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </Protected>
  );
}