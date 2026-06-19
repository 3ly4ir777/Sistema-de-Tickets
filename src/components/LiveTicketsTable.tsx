import React from 'react';
import { CheckCircle, Clock, AlertTriangle } from 'lucide-react';

export default function LiveTicketsTable() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col lg:col-span-2">
      <h3 className="font-bold text-slate-800 text-base mb-4 flex items-center gap-2">
        <CheckCircle className="text-green-600" size={18} />
        Monitoreo Reciente de Tickets Activos
      </h3>
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-500 uppercase text-xs border-b border-slate-200">
            <tr>
              <th className="py-3 px-4 font-semibold">ID</th>
              <th className="py-3 px-4 font-semibold">Tipo</th>
              <th className="py-3 px-4 font-semibold">Código Res.</th>
              <th className="py-3 px-4 font-semibold">Prioridad</th>
              <th className="py-3 px-4 font-semibold">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr className="hover:bg-slate-50/80 transition-colors">
              <td className="py-3 px-4 font-medium text-slate-900">#3899</td>
              <td className="py-3 px-4"><span className="px-2 py-0.5 text-xs bg-indigo-50 text-indigo-700 rounded-full font-medium">Incident</span></td>
              <td className="py-3 px-4 text-slate-500">Configuration</td>
              <td className="py-3 px-4"><span className="text-red-600 font-semibold">P1</span></td>
              <td className="py-3 px-4"><span className="inline-flex items-center gap-1.5 text-emerald-600 font-medium"><Clock size={14}/> Cerrado (86%)</span></td>
            </tr>
            <tr className="hover:bg-slate-50/80 transition-colors">
              <td className="py-3 px-4 font-medium text-slate-900">#2796</td>
              <td className="py-3 px-4"><span className="px-2 py-0.5 text-xs bg-cyan-50 text-cyan-700 rounded-full font-medium">Service Req.</span></td>
              <td className="py-3 px-4 text-slate-500">No action taken</td>
              <td className="py-3 px-4"><span className="text-amber-600 font-semibold">P2</span></td>
              <td className="py-3 px-4"><span className="inline-flex items-center gap-1.5 text-cyan-600 font-medium"><Clock size={14}/> En Progreso</span></td>
            </tr>
            <tr className="hover:bg-slate-50/80 transition-colors">
              <td className="py-3 px-4 font-medium text-slate-900">#1834</td>
              <td className="py-3 px-4"><span className="px-2 py-0.5 text-xs bg-indigo-50 text-indigo-700 rounded-full font-medium">Incident</span></td>
              <td className="py-3 px-4 text-slate-500">Configuration</td>
              <td className="py-3 px-4"><span className="text-red-600 font-semibold">P1</span></td>
              <td className="py-3 px-4"><span className="inline-flex items-center gap-1.5 text-amber-500 font-medium"><AlertTriangle size={14}/> Pendiente</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}