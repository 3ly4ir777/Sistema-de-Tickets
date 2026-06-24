import React from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { ShieldCheck, Clock, Settings2 } from 'lucide-react';

interface SLAPolicy {
  id: number;
  name: string;
  targetResponse: string;
  targetResolution: string;
  complianceRate: string;
}

const mockSLAs: SLAPolicy[] = [
  { id: 1, name: 'SLA Prioridad 1 (Crítico)', targetResponse: '15 Minutos', targetResolution: '2 Horas', complianceRate: '86%' },
  { id: 2, name: 'SLA Prioridad 2 (Estándar)', targetResponse: '1 Hora', targetResolution: '24 Horas', complianceRate: '81%' }
];

export default function SlasPage() {
  return (
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
            {mockSLAs.map((policy) => (
              <div key={policy.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 text-[#1d2d5b] rounded-lg">
                      <ShieldCheck size={20} />
                    </div>
                    <h3 className="font-bold text-slate-800 text-lg">{policy.name}</h3>
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
                      <p className="font-bold text-slate-700 mt-1">{policy.targetResponse}</p>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg flex items-center gap-3">
                    <Clock size={18} className="text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-semibold leading-none">Meta de Solución</p>
                      <p className="font-bold text-slate-700 mt-1">{policy.targetResolution}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center text-sm">
                  <span className="text-slate-500">Cumplimiento Histórico:</span>
                  <span className="text-emerald-600 font-extrabold text-lg">{policy.complianceRate}</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}