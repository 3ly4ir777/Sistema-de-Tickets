"use client";

import React from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import Protected from '@/components/Protected';

export default function DashboardPage() {
  return (
    <Protected>
      <div className="flex h-screen bg-slate-100 font-sans overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-y-auto">
          <Navbar />
          <main className="p-6 max-w-[1600px] w-full mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Panel de Control</h1>
                <p className="text-sm text-slate-500">Resumen ejecutivo de tickets, SLAs y actividad reciente.</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <p className="text-sm text-slate-500">Resumen en construcción. Usa los módulos laterales para navegar.</p>
            </div>
          </main>
        </div>
      </div>
    </Protected>
  );
}