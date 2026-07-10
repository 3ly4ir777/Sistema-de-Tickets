'use client';

import React, {useState} from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { Filter, Plus, X } from 'lucide-react';
import TicketForm  from '@/components/TicketForm';
import LiveTicketsTable from '@/components/LiveTicketsTable';
import Protected from '@/components/Protected';
import { useAuth } from '@/hooks/useAuth';

export default function TicketsPage() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  const handleTicketCreated = () => {
    setIsModalOpen(false);
    // La tabla recargará en su propio effect, o se puede implementar un evento/refresh
  }

  return (
    <Protected>
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
              <button 
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-medium text-sm px-4 py-2.5 rounded-lg shadow-sm transition-colors">
                <Plus size={16} /> Nuevo Ticket
              </button>
            </div>


            <LiveTicketsTable />
          </main>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-2xl bg-white rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg">Nuevo Ticket</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-500">Cerrar</button>
              </div>
              <TicketForm userId={user?.id || ''} slas={[]} onSubmitSuccess={handleTicketCreated} />
            </div>
          </div>
        )}
      </div>
    </Protected>
  );
}