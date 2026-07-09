'use client';

import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/Protected'; // Ajusta la ruta según tu proyecto
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabaseClient';
import { Shield, Clock, CheckCircle, User, Plus, RefreshCw, AlertCircle } from 'lucide-react';
import Protected from '@/components/Protected';

// Interfaces para tipar nuestros datos de Supabase
interface SLA {
  id: number;
  name: string;
  target_response_seconds: number;
  target_resolution_seconds: number;
}

interface ResolutionCode {
  id: number;
  code: string;
  description: string;
}

// export default function ConfiguracionPage() {
//   return (
//     // Protegemos la ruta para que solo entren usuarios logueados
//     <ProtectedRoute allowedRoles={['administrador', 'encargado_sistemas', 'usuario']}>
//       <ConfiguracionContent />
//     </ProtectedRoute>
//   );
// }

function ConfiguracionContent() {
  const { user } = useAuth();
  
  // Estados para SLAs
  const [slas, setSlas] = useState<SLA[]>([]);
  const [newSlaName, setNewSlaName] = useState('');
  const [newSlaResponse, setNewSlaResponse] = useState(2); // en horas para el formulario
  const [newSlaResolution, setNewSlaResolution] = useState(24); // en horas para el formulario

  // Estados para Códigos de Resolución
  const [codes, setCodes] = useState<ResolutionCode[]>([]);
  const [newCode, setNewCode] = useState('');
  const [newCodeDesc, setNewCodeDesc] = useState('');

  // Estados globales de carga/error
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Cargar datos desde Supabase
  const fetchData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      // 1. Traer SLAs
      const { data: slasData, error: slasError } = await supabase
        .from('slas')
        .select('*')
        .order('id', { ascending: true });
      if (slasError) throw slasError;
      setSlas(slasData || []);

      // 2. Traer Códigos de Resolución
      const { data: codesData, error: codesError } = await supabase
        .from('resolution_codes')
        .select('*')
        .order('id', { ascending: true });
      if (codesError) throw codesError;
      setCodes(codesData || []);

    } catch (err: any) {
      console.error("Error cargando configuración:", err);
      setErrorMsg("No se pudieron cargar algunos datos de configuración.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Guardar un nuevo SLA
  const handleCreateSLA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlaName) return;

    try {
      // Convertimos las horas ingresadas a segundos para la Base de Datos
      const responseSeconds = newSlaResponse * 3600;
      const resolutionSeconds = newSlaResolution * 3600;

      const { error } = await supabase
        .from('slas')
        .insert([
          { 
            name: newSlaName, 
            target_response_seconds: responseSeconds, 
            target_resolution_seconds: resolutionSeconds 
          }
        ]);

      if (error) throw error;

      // Limpiar formulario y recargar
      setNewSlaName('');
      fetchData();
    } catch (err: any) {
      alert("Error al crear SLA: " + err.message);
    }
  };

  // Guardar un nuevo Código de Resolución
  const handleCreateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode) return;

    try {
      const { error } = await supabase
        .from('resolution_codes')
        .insert([{ code: newCode, description: newCodeDesc }]);

      if (error) throw error;

      setNewCode('');
      setNewCodeDesc('');
      fetchData();
    } catch (err: any) {
      alert("Error al crear código: " + err.message);
    }
  };

  // Si el usuario es un cliente común, no le mostramos la gestión de SLAs
  const isAdminOrSystems = user?.role === 'administrador' || user?.role === 'encargado_sistemas';

  return (
    <Protected>
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-10">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Shield className="text-cyan-400" /> Panel de Configuración
          </h1>
          <p className="text-slate-400 mt-1">
            Gestiona las políticas de la plataforma, tiempos de respuesta y tu perfil.
          </p>
        </div>
        <button 
          onClick={fetchData}
          className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-sm px-4 py-2 rounded-lg transition-colors border border-slate-700 self-start md:self-auto"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Sincronizar
        </button>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl flex items-center gap-2 text-sm">
          <AlertCircle size={20} />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMNA 1: PERFIL DE USUARIO (Para todos) */}
        <div className="bg-slate-800/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm h-fit">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 border-b border-slate-700 pb-2 text-cyan-400">
            <User size={20} /> Mi Cuenta
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 font-medium uppercase tracking-wider">Nombre Completo</label>
              <p className="text-base font-medium mt-1 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800 text-white">{user?.name}</p>
            </div>
            <div>
              <label className="block text-xs text-slate-400 font-medium uppercase tracking-wider">Correo Electrónico</label>
              <p className="text-base font-medium mt-1 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800 text-white">{user?.email}</p>
            </div>
            <div>
              <label className="block text-xs text-slate-400 font-medium uppercase tracking-wider">Rol Asignado</label>
              <span className="inline-flex mt-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* COLUMNAS 2 y 3: GESTIÓN INTERNA (Solo Admin y Sistemas) */}
        {isAdminOrSystems ? (
          <div className="lg:col-span-2 space-y-8">
            
            {/* SECCIÓN DE SLAs */}
            <div className="bg-slate-800/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 border-b border-slate-700 pb-2 text-cyan-400">
                <Clock size={20} /> Políticas de SLA (Tiempos de Servicio)
              </h2>

              {/* Formulario rápido para agregar SLA */}
              {user?.role === 'administrador' && (
                <form onSubmit={handleCreateSLA} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-slate-900/40 p-4 rounded-xl border border-slate-800">
                  <div className="md:col-span-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Crear Nueva Política</h3>
                  </div>
                  <div>
                    <input 
                      type="text" 
                      placeholder="Nombre (ej: Prioridad Alta)" 
                      value={newSlaName}
                      onChange={e => setNewSlaName(e.target.value)}
                      className="w-full bg-slate-900 text-white text-sm border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500"
                      required
                    />
                  </div>
                  <div>
                    <input 
                      type="number" 
                      placeholder="Resp. (Horas)" 
                      value={newSlaResponse}
                      onChange={e => setNewSlaResponse(Number(e.target.value))}
                      className="w-full bg-slate-900 text-white text-sm border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500"
                      min="0"
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      placeholder="Reso. (Horas)" 
                      value={newSlaResolution}
                      onChange={e => setNewSlaResolution(Number(e.target.value))}
                      className="w-full bg-slate-900 text-white text-sm border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500"
                      min="1"
                      required
                    />
                    <button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 p-2 rounded-lg font-bold transition-colors">
                      <Plus size={18} />
                    </button>
                  </div>
                </form>
              )}

              {/* Tabla / Lista de SLAs */}
              <div className="space-y-3">
                {slas.map(sla => (
                  <div key={sla.id} className="flex justify-between items-center bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                    <div>
                      <h4 className="font-medium text-white text-sm">{sla.name}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Respuesta: <span className="text-slate-200">{(sla.target_response_seconds / 3600).toFixed(1)}h</span> | 
                        Resolución: <span className="text-slate-200">{(sla.target_resolution_seconds / 3600).toFixed(1)}h</span>
                      </p>
                    </div>
                    <span className="text-xs bg-slate-800 px-2.5 py-1 rounded border border-slate-700 text-slate-400">ID: {sla.id}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SECCIÓN DE CÓDIGOS DE RESOLUCIÓN */}
            <div className="bg-slate-800/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 border-b border-slate-700 pb-2 text-cyan-400">
                <CheckCircle size={20} /> Códigos de Resolución (Cierre de Tickets)
              </h2>

              {/* Formulario rápido para agregar Códigos */}
              {user?.role === 'administrador' && (
                <form onSubmit={handleCreateCode} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-slate-900/40 p-4 rounded-xl border border-slate-800">
                  <div className="md:col-span-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Crear Código de Cierre</h3>
                  </div>
                  <div>
                    <input 
                      type="text" 
                      placeholder="Código (ej: Hardware_Fix)" 
                      value={newCode}
                      onChange={e => setNewCode(e.target.value)}
                      className="w-full bg-slate-900 text-white text-sm border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500"
                      required
                    />
                  </div>
                  <div className="md:col-span-2 flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Descripción breve de la solución" 
                      value={newCodeDesc}
                      onChange={e => setNewCodeDesc(e.target.value)}
                      className="w-full bg-slate-900 text-white text-sm border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500"
                    />
                    <button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 p-2 rounded-lg font-bold transition-colors">
                      <Plus size={18} />
                    </button>
                  </div>
                </form>
              )}

              {/* Lista de Códigos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {codes.map(c => (
                  <div key={c.id} className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between">
                    <div>
                      <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-500/5 border border-cyan-500/10 px-2 py-0.5 rounded">
                        {c.code}
                      </span>
                      <p className="text-xs text-slate-300 mt-2">{c.description || 'Sin descripción.'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          /* Mensaje para usuarios regulares */
          <div className="lg:col-span-2 bg-slate-800/20 border border-slate-800/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
            <p className="text-slate-400 max-w-sm text-sm">
              Las configuraciones avanzadas del sistema (SLAs, tiempos de atención y códigos de cierre) solo están disponibles para el personal de administración y soporte técnico.
            </p>
          </div>
        )}

      </div>
    </div>
    </Protected>
  );
}