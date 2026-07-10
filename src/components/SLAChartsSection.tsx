'use client';
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { supabase } from '@/lib/supabaseClient';
import { Loader2 } from 'lucide-react';

// Parche definitivo para silenciar las alertas de tamaño de Recharts en Next.js/Turbopack
if (typeof window !== 'undefined') {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (
      args[0] && 
      typeof args[0] === 'string' && 
      args[0].includes('The width(-1) and height(-1) of chart should be greater than 0')
    ) {
      return; 
    }
    originalWarn(...args);
  };
}

export default function SLAChartsSection() {
  const [loading, setLoading] = useState(true);

  // Estados para almacenar la data formateada para Recharts
  const [totalTicketsData, setTotalTicketsData] = useState<any[]>([]);
  const [topResolutionData, setTopResolutionData] = useState<any[]>([]);
  const [incidentClosureData, setIncidentClosureData] = useState<any[]>([]);
  const [serviceRequestClosureData, setServiceRequestClosureData] = useState<any[]>([]);
  const [priorityData, setPriorityData] = useState<any[]>([]);
  const [dailyTrendData, setDailyTrendData] = useState<any[]>([]);

  // Porcentajes para colocar al centro de los Donuts
  const [incidentClosedPct, setIncidentClosedPct] = useState(0);
  const [srClosedPct, setSrClosedPct] = useState(0);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);

        // 1. Traer todos los tickets con su código de resolución relacionado
        const { data: tickets, error } = await supabase
          .from('tickets')
          .select('*, resolution_codes(code)');

        if (error) throw error;
        if (!tickets) return;

        // --- MÉTRICA 1 & 4: Total por tipo y desglose por Prioridades ---
        const incidentTickets = tickets.filter(t => t.type === 'Incident');
        const srTickets = tickets.filter(t => t.type === 'Service Request');

        setTotalTicketsData([
          { name: 'Incident', count: incidentTickets.length, fill: '#1d2d5b' },
          { name: 'Service Request', count: srTickets.length, fill: '#7bf1fa' }
        ]);

        setPriorityData([
          {
            name: 'Incident',
            P1: incidentTickets.filter(t => t.priority === 'P1').length,
            P2: incidentTickets.filter(t => t.priority === 'P2').length,
          },
          {
            name: 'Service Request',
            P1: srTickets.filter(t => t.priority === 'P1').length,
            P2: srTickets.filter(t => t.priority === 'P2').length,
          }
        ]);

        // --- MÉTRICA 2: Top códigos de resolución (Incidentes cerrados) ---
        const codesMap: Record<string, number> = {};
        incidentTickets.forEach(t => {
          if (t.status === 'closed' && t.resolution_codes?.code) {
            const codeName = t.resolution_codes.code;
            codesMap[codeName] = (codesMap[codeName] || 0) + 1;
          }
        });
        const formattedCodes = Object.entries(codesMap)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
        setTopResolutionData(formattedCodes.length ? formattedCodes : [{ name: 'Sin cierres', count: 0 }]);

        // --- MÉTRICA 3: Cierres de Tickets (Doughnuts) ---
        const closedIncidents = incidentTickets.filter(t => t.status === 'closed').length;
        const remainingIncidents = incidentTickets.length - closedIncidents;
        const incPct = incidentTickets.length ? Math.round((closedIncidents / incidentTickets.length) * 100) : 0;
        setIncidentClosedPct(incPct);
        setIncidentClosureData([
          { name: 'Closed', value: closedIncidents, color: '#1d2d5b' },
          { name: 'Remaining', value: remainingIncidents, color: '#e2e8f0' }
        ]);

        const closedSR = srTickets.filter(t => t.status === 'closed').length;
        const remainingSR = srTickets.length - closedSR;
        const srPct = srTickets.length ? Math.round((closedSR / srTickets.length) * 100) : 0;
        setSrClosedPct(srPct);
        setServiceRequestClosureData([
          { name: 'Closed', value: closedSR, color: '#1d2d5b' },
          { name: 'Remaining', value: remainingSR, color: '#7bf1fa' }
        ]);

        // --- MÉTRICA 5: Tendencia diaria de creación (Últimos 7 días) ---
        const dailyMap: Record<string, { date: string; Incident: number; ServiceRequest: number }> = {};
        
        // Inicializamos los últimos 5 días con ceros para que la gráfica no luzca vacía
        for (let i = 4; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dateStr = d.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
          dailyMap[dateStr] = { date: dateStr, Incident: 0, ServiceRequest: 0 };
        }

        tickets.forEach(t => {
          if (!t.created_at) return;
          const dateStr = new Date(t.created_at).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
          if (dailyMap[dateStr]) {
            if (t.type === 'Incident') dailyMap[dateStr].Incident++;
            if (t.type === 'Service Request') dailyMap[dateStr].ServiceRequest++;
          }
        });

        setDailyTrendData(Object.values(dailyMap));

      } catch (err) {
        console.error('Error calculando métricas de gráficos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-3 text-slate-400 bg-white border border-slate-200 rounded-xl shadow-sm">
        <Loader2 className="animate-spin text-cyan-500" size={32} />
        <p className="text-sm font-medium">Procesando métricas desde Supabase...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* PRIMERA FILA DE GRÁFICAS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Total Tickets */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-center font-bold text-slate-700 border-b pb-2 mb-4 text-sm tracking-wider uppercase bg-slate-50 py-1 rounded">
            Nbr of Tickets- Total
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={totalTicketsData} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" allowDecimals={false} />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {totalTicketsData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Resolution Code */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-center font-bold text-slate-700 border-b pb-2 mb-4 text-sm tracking-wider uppercase bg-slate-50 py-1 rounded">
            Top 5 Resolution code - Incident
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topResolutionData} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" allowDecimals={false} />
                <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#1d2d5b" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ticket Closure (Doughnuts) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-center font-bold text-slate-700 border-b pb-2 mb-4 text-sm tracking-wider uppercase bg-slate-50 py-1 rounded">
            Ticket Closure
          </h3>
          <div className="grid grid-cols-2 h-64 items-center">
            <div className="flex flex-col items-center">
              <span className="text-xs font-semibold text-slate-500 mb-2">Incident</span>
              <div className="w-28 h-28 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={incidentClosureData} innerRadius={32} outerRadius={44} dataKey="value" startAngle={90} endAngle={-270}>
                      {incidentClosureData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute font-bold text-base text-slate-700">{incidentClosedPct}%</div>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-xs font-semibold text-slate-500 mb-2">Service Request</span>
              <div className="w-28 h-28 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={serviceRequestClosureData} innerRadius={32} outerRadius={44} dataKey="value" startAngle={90} endAngle={-270}>
                      {serviceRequestClosureData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute font-bold text-base text-slate-700">{srClosedPct}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEGUNDA FILA DE GRÁFICAS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Priority Bar Chart */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm lg:col-span-1">
          <h3 className="text-center font-bold text-slate-700 border-b pb-2 mb-4 text-sm tracking-wider uppercase bg-slate-50 py-1 rounded">
            Nbr of Tickets-Priority
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" allowDecimals={false} />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="P1" stackId="a" fill="#1d2d5b" name="Prioridad 1" />
                <Bar dataKey="P2" stackId="a" fill="#7bf1fa" name="Prioridad 2" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Creation Trend Line Chart */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm lg:col-span-2">
          <h3 className="text-center font-bold text-slate-700 border-b pb-2 mb-4 text-sm tracking-wider uppercase bg-slate-50 py-1 rounded">
            Daily Ticket Creation Trend
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="Incident" stroke="#1d2d5b" strokeWidth={2} dot={{ r: 2 }} />
                <Line type="monotone" dataKey="ServiceRequest" stroke="#48cae4" strokeWidth={2} dot={{ r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}