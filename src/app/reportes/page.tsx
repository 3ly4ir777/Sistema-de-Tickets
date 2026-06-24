import React from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { BarChart3, Download, Calendar } from 'lucide-react';

export default function ReportesPage() {
  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Navbar />
        <main className="p-6 max-w-[1600px] w-full mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Módulo de Reportes y Descargas</h1>
              <p className="text-sm text-slate-500">Exporta auditorías en formato Excel o PDF sobre la velocidad de la mesa de soporte.</p>
            </div>
            <button className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg shadow-sm transition-colors">
              <Download size={16} /> Exportar Datos
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
              <BarChart3 className="text-indigo-600" size={18} /> Historial Operativo
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-slate-100 p-4 rounded-xl bg-slate-50/50">
                <p className="text-xs font-semibold text-slate-400 uppercase">Tiempo Promedio de Respuesta</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">24 Minutos</p>
              </div>
              <div className="border border-slate-100 p-4 rounded-xl bg-slate-50/50">
                <p className="text-xs font-semibold text-slate-400 uppercase">Total Tickets Cerrados Mes</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">1,240 Casos</p>
              </div>
              <div className="border border-slate-100 p-4 rounded-xl bg-slate-50/50">
                <p className="text-xs font-semibold text-slate-400 uppercase">Porcentaje de Violación SLA</p>
                <p className="text-2xl font-bold text-red-600 mt-1">14%</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}