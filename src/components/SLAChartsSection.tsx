import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';

// Parche definitivo para silenciar las alertas de tamaño de Recharts en Next.js/Turbopack
// La librería tiene error de alerta falsa que no afecta la funcionalidad, pero ensucia la consola.
if (typeof window !== 'undefined') {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (
      args[0] && 
      typeof args[0] === 'string' && 
      args[0].includes('The width(-1) and height(-1) of chart should be greater than 0')
    ) {
      return; // Ignora esta alerta molesta y falsa
    }
    originalWarn(...args);
  };
}


// Mock Data
const totalTicketsData = [
  { name: 'Incident', count: 3899, fill: '#1d2d5b' },
  { name: 'Service Request', count: 2796, fill: '#7bf1fa' }
];

const topResolutionData = [
  { name: 'Configuration', count: 1834 },
  { name: 'No action taken', count: 611 },
  { name: 'Text Here 1', count: 368 },
  { name: 'Text Here 2', count: 360 }
];

const incidentClosureData = [
  { name: 'Closed', value: 86, color: '#1d2d5b' },
  { name: 'Remaining', value: 14, color: '#e2e8f0' }
];

const serviceRequestClosureData = [
  { name: 'Closed', value: 81, color: '#1d2d5b' },
  { name: 'Remaining', value: 19, color: '#7bf1fa' }
];

const priorityData = [
  { name: 'Incident', P1: 3346, P2: 553 },
  { name: 'Service Request', P1: 3178, P2: 382 }
];

const dailyTrendData = [
  { date: 'Mar 25', Incident: 130, ServiceRequest: 200 },
  { date: 'T1', Incident: 127, ServiceRequest: 3 },
  { date: 'T2', Incident: 128, ServiceRequest: 15 },
  { date: 'T3', Incident: 15, ServiceRequest: 10 },
  { date: 'T4', Incident: 185, ServiceRequest: 190 },
  { date: 'T5', Incident: 180, ServiceRequest: 130 },
  { date: 'T6', Incident: 170, ServiceRequest: 140 },
  { date: 'T7', Incident: 190, ServiceRequest: 135 },
  { date: 'T8', Incident: 5, ServiceRequest: 8 },
  { date: 'T9', Incident: 190, ServiceRequest: 10 },
  { date: 'T10', Incident: 115, ServiceRequest: 150 },
  { date: 'T11', Incident: 125, ServiceRequest: 140 },
  { date: 'T12', Incident: 130, ServiceRequest: 120 },
  { date: 'Apr 27', Incident: 15, ServiceRequest: 7 }
];

export default function SLAChartsSection() {
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
            <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={100} id="chart-total-tickets">
              <BarChart data={totalTicketsData} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 4000]} />
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
            <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={100} id="chart-top-resolution">

              <BarChart data={topResolutionData} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 2000]} />
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
                <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={100} id="chart-ticket-closure-incident">
                  <PieChart>
                    <Pie data={incidentClosureData} innerRadius={32} outerRadius={44} dataKey="value" startAngle={90} endAngle={-270}>
                      {incidentClosureData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute font-bold text-base text-slate-700">86%</div>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-xs font-semibold text-slate-500 mb-2">Service Request</span>
              <div className="w-28 h-28 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={100} id="chart-ticket-closure-service-request">
                  <PieChart>
                    <Pie data={serviceRequestClosureData} innerRadius={32} outerRadius={44} dataKey="value" startAngle={90} endAngle={-270}>
                      {serviceRequestClosureData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute font-bold text-base text-slate-700">81%</div>
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
            <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={100} id="chart-priority">
              <BarChart data={priorityData} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 4000]} />
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
            <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={100} id="chart-daily-creation">
              <LineChart data={dailyTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="Incident" stroke="#1d2d5b" strokeWidth={2} dot={{ r: 1 }} />
                <Line type="monotone" dataKey="ServiceRequest" stroke="#48cae4" strokeWidth={2} dot={{ r: 1 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}