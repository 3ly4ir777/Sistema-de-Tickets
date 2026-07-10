"use client";

import React from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import TicketForm from '@/components/TicketForm';
import Protected from '@/components/Protected';
import { useAuth } from '@/hooks/useAuth';

export default function NewTicketPage() {
  const { user } = useAuth();

  return (
    <Protected>
      <div className="flex h-screen bg-slate-100 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-y-auto">
          <Navbar />
          <main className="p-6 max-w-800 w-full mx-auto">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h2 className="font-bold text-slate-400 mb-4">Nuevo Ticket</h2>
              <TicketForm userId={user?.id || ''} slas={[]} onSubmitSuccess={() => { window.location.href = '/tickets'; }} />
            </div>
          </main>
        </div>
      </div>
    </Protected>
  );
}