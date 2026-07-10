'use client';
import React, { useState } from 'react';

interface TicketFormProps {
  userId: string;
  slas: { id: number; name: string }[]; // Cambiado a number porque en tu DB slas.id es serial (integer)
  onSubmitSuccess?: () => void; 
}

export default function TicketForm({ userId, slas, onSubmitSuccess }: TicketFormProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<'Incident' | 'Service Request'>('Incident');
    const [priority, setPriority] = useState<'P1' | 'P2'>('P2');
    const [selectedSla, setSelectedSla] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(undefined);

        try {
            const { supabase } = await import('@/lib/supabaseClient');
            
            const { error: supabaseError } = await supabase
                .from('tickets')
                .insert({
                    title,
                    description,
                    type, // Envía 'Incident' o 'Service Request' tal cual tu ENUM de Postgres
                    priority, // Envía 'P1' o 'P2' tal cual tu ENUM de Postgres
                    requester_id: userId,
                    sla_id: selectedSla ? parseInt(selectedSla) : null
                });

            if (supabaseError) {
                console.error('Error creando ticket:', supabaseError);
                setError(supabaseError.message || 'Error creando ticket');
            } else {
                // Limpiar formulario si todo sale bien
                setTitle('');
                setDescription('');
                setType('Incident');
                setPriority('P2');
                setSelectedSla('');
                if (onSubmitSuccess) onSubmitSuccess();
            }
        } catch (err: any) {
            console.error('Excepción al crear ticket', err);
            setError(err.message || 'Error desconocido');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-slate-200 bg-slate-800/40 p-6 rounded-xl border border-slate-700/50">
            <h2 className="text-xl font-bold text-white mb-2">Abrir un Nuevo Ticket</h2>
            
            {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <div className="space-y-1.5 flex flex-col">
                <label className="text-sm font-medium text-slate-300">Título del Incidente / Requerimiento</label>
                <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500"
                    placeholder="ej. Fallo crítico en la configuración del servidor"
                />
            </div>

            <div className="space-y-1.5 flex flex-col">
                <label className="text-sm font-medium text-slate-300">Descripción Detallada</label>
                <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500"
                    placeholder="ej. El servidor dejó de responder tras aplicar el parche..."
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5 flex flex-col">
                    <label className="text-sm font-medium text-slate-300">Tipo de Ticket</label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value as 'Incident' | 'Service Request')}
                        className="bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500"
                    >
                        <option value="Incident">Incidente</option>
                        <option value="Service Request">Requerimiento de Servicio</option>
                    </select>
                </div>

                <div className="space-y-1.5 flex flex-col">
                    <label className="text-sm font-medium text-slate-300">Prioridad</label>
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as 'P1' | 'P2')}
                        className="bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500"
                    >
                        <option value="P1">P1 - Alta</option>
                        <option value="P2">P2 - Media</option>
                    </select>
                </div>

                <div className="space-y-1.5 flex flex-col">
                    <label className="text-sm font-medium text-slate-300">Vincular SLA (Opcional)</label>
                    <select
                        value={selectedSla}
                        onChange={(e) => setSelectedSla(e.target.value)}
                        className="bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500"
                    >
                        <option value="">Selecciona una política...</option>
                        {slas.map((sla) => (
                            <option key={sla.id} value={sla.id}>
                                {sla.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <button 
                type="submit" 
                disabled={isSubmitting} 
                className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold px-4 py-2.5 rounded-lg mt-2 transition-colors disabled:opacity-50">
                {isSubmitting ? 'Guardando Ticket...' : 'Abrir Ticket'}
            </button>
        </form>
    );
}