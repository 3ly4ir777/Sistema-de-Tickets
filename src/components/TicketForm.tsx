'use client';
import React, { useState } from 'react';

interface TicketFormProps {
  userId: string;
  slas: { id: number; name: string }[];
  onSubmitSuccess?: () => void; 
}

export default function TicketForm({ userId, slas, onSubmitSuccess }: TicketFormProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<'Incident' | 'Service Request'>('Incident');
    const [priority, setPriority] = useState<'P1' | 'P2'>('P2');
    const [isSubmitting, setIsSubmitting] = useState(false);
    // ✅ Corrección: Definimos que el estado puede aceptar un string o ser undefined
    const [error, setError] = useState<string | undefined>(undefined);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(undefined);

        try {
            // Insert ticket into Supabase 'tickets' table
            const { data, error: supabaseError } = await (await import('@/lib/supabaseClient')).supabase
                .from('tickets')
                .insert({
                    title,
                    description,
                    type: type === 'Incident' ? 'Incident' : 'Service Request',
                    priority: priority === 'P1' ? 'P1' : 'P2',
                    requester_id: userId,
                    created_at: new Date().toISOString()
                })
                .select()
                .single();

            if (supabaseError) {
                console.error('Error creando ticket:', supabaseError);
                setError(supabaseError.message || 'Error creando ticket');
            } else {
                // clear form
                setTitle('');
                setDescription('');
                setType('Incident');
                setPriority('P2');
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-slate-400">
            <h2>Creaar nuevo Ticket</h2>
            
            {/* ✅ Visualización del mensaje de error si existe */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
                    {error}
                </div>
            )}

            <div className="space-y-2 flex flex-col">
                <label>Título del Incidente / Requerimiento</label>
                <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border rounded px-3 py-2"
                    placeholder="ej. Fallo crítico en la configuración del servidor"
                />
            </div>

            <div className="space-y-2 flex flex-col">
                <label>Descripción Detallada del Incidente / Requerimiento</label>
                <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border rounded px-3 py-2"
                    placeholder="ej. El servidor dejó de responder tras aplicar el parche"
                />
            </div>

            <div className="space-y-2 flex flex-col">
                <label>Tipo de Ticket</label>
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value as 'Incident' | 'Service Request')}
                    className="border rounded px-3 py-2"
                >
                    <option value="Incident">Incidente</option>
                    <option value="Service Request">Requerimiento de Servicio</option>
                </select>
            </div>

            <div className="space-y-2 flex flex-col">
                <label>Prioridad</label>
                <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as 'P1' | 'P2')}
                    className="border rounded px-3 py-2"
                >
                    <option value="P1">P1 - Alta</option>
                    <option value="P2">P2 - Media</option>
                </select>
            </div>


            <button 
                type="submit" 
                disabled={isSubmitting} 
                className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-300">
                {isSubmitting ? 'Guardando Ticket...' : 'Abrir Ticket'}
            </button>
        </form>
    );
}
