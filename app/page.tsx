import React from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import SLABanner from '@/components/SLABanner';
import SLAChartsSection from '@/components/SLAChartsSection';
import CommentForm from '@/components/CommentForm';
import LiveTicketsTable from '@/components/LiveTicketsTable';

export default function SLADashboardPage() {
  return (
    <div className="flex h-screen bg-slate-100 font-sans overflow-hidden">
      {/* Barra Lateral Reutilizable */}
      <Sidebar />

      {/* Contenedor de la derecha */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Barra de Navegación Superior Reutilizable */}
        <Navbar />

        {/* Cuerpo del Dashboard */}
        <main className="p-6 space-y-6 max-w-[1600px] w-full mx-auto">
          {/* Banner de título */}
          <SLABanner title="Panel de control SLA que ilustra el incidente del ticket y la solicitud de servicio" />

          {/* Sección Completa de Gráficas (Fila 1 y Fila 2) */}
          <SLAChartsSection />

          {/* Sección Inferior: Formulario + Tabla */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <CommentForm />
            <LiveTicketsTable />
          </div>
        </main>
      </div>
    </div>
  );
}