import React from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { Filter, Plus, ArrowUpDown } from 'lucide-react';

interface TicketItem {
  id: string;
  title: string;
  type: 'Incident' | 'Service Request';
  priority: 'P1' | 'P2';
  assignedTo: string;
  status: 'Open' | 'Inprog' | 'Pending' | 'Closed';
}

const mockTickets: TicketItem[] = [
  { id: 'TKT-3899', title: 'Fallo Crítico en Configuración del Servidor', type: 'Incident', priority: 'P1', assignedTo: 'Carlos (Sistemas)', status: 'Inprog' },
  { id: 'TKT-2796', title: 'Solicitud de Nueva Licencia de Software', type: 'Service Request', priority: 'P2', assignedTo: 'Sin Asignar', status: 'Open' },
  { id: 'TKT-1834', title: 'Error de Red en Oficina del Segundo Piso', type: 'Incident', priority: 'P1', assignedTo: 'Ana Martínez', status: 'Pending' }
];

export default function TicketsPage() {
  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Navbar />
        <main className="p-6 max-w-[1600px] w-full mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Buzón General de Tickets</h1>
              <p className="text-sm text-slate-500">Administra, asigna y da seguimiento a los casos abiertos.</p>
            </div>
            <button className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-medium text-sm px-4 py-2.5 rounded-lg shadow-sm transition-colors">
              <Plus size={16} /> Nuevo Ticket
            </button>
          </div>

          {/* Filtros */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-3 items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Filter size={14} /> Filtrar por:
              </span>
              <select className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-600 focus:outline-none">
                <option>Todos los Estados</option>
                <option>Abiertos</option>
                <option>En Progreso</option>
                <option>Cerrados</option>
              </select>
              <select className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-600 focus:outline-none">
                <option>Todas las Prioridades</option>
                <option>P1 - Alta</option>
                <option>P2 - Estándar</option>
              </select>
            </div>
          </div>

          {/* Tabla de Tickets */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase text-xs border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">Código ID</th>
                  <th className="py-3 px-4 font-semibold">Asunto</th>
                  <th className="py-3 px-4 font-semibold">Tipo</th>
                  <th className="py-3 px-4 font-semibold">Prioridad</th>
                  <th className="py-3 px-4 font-semibold">Encargado</th>
                  <th className="py-3 px-4 font-semibold">Estatus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50/60 transition-colors cursor-pointer">
                    <td className="py-4 px-4 font-bold text-slate-900">{ticket.id}</td>
                    <td className="py-4 px-4 font-medium text-slate-800">{ticket.title}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${ticket.type === 'Incident' ? 'bg-indigo-50 text-indigo-700' : 'bg-cyan-50 text-cyan-700'}`}>
                        {ticket.type}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-red-600 font-bold">{ticket.priority}</td>
                    <td className="py-4 px-4 text-slate-500 font-medium">{ticket.assignedTo}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${
                        ticket.status === 'Open' ? 'bg-emerald-100 text-emerald-800' :
                        ticket.status === 'Inprog' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ticket.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}