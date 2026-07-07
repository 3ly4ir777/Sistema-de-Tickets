'use client';
import React, { useState} from 'react';

interface TicketFormProps {
  userId: string;
  slas: {id: string, name: string}[];
  onSubmitSuccess?: () => void; 
}

export default function TicketForm ({ userId, slas, onSubmitSuccess }: TicketFormProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<'Incident' | 'Service Request'>('Incident');
    const [priority, setPriority] = useState<'P1' | 'P2'>('P2');
    const [isSubmitting, SetIsSubmitting] = useState(false);
    const [error, SetError] = useState();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        SetIsSubmitting (true);
        SetError(undefined);

        const TicketData = {
            title,
            description,
            type,
            priority,
            userId,

            //checar en el sql si hay mas datos para guardar
        };

        //llamada de api a supabase

    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>
                Create Ticket
            </h2>
            <div className="space-y-2">
                <label htmlFor="">Titulo del Incidente / Requerimiento</label>
                <input

                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border rounded px-3 py-2"
                    placeholder= " ej. Fallo critico en la configuracion del servidor"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="">Descripcion Detallada del Incidente / Requerimiento</label>
                <textarea

                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border rounded px-3 py-2"
                    placeholder= " ej. Fallo critico en la configuracion del servidor"
                />
            </div>
            

            <button 
            type="submit" 
            disabled={isSubmitting} 
            className="bg-blue-500 text-white px-4 py-2 rounded">
                {isSubmitting ? 'Guardando Ticket...' : 'Abrir Ticket'}
            </button>
        
        
        </form>
    )
    
}