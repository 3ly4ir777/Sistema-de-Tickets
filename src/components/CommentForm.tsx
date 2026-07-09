'use client';
import React, { FormEvent } from 'react';
import { MessageSquare } from 'lucide-react';

export default function CommentForm({ ticketId }: { ticketId?: string }) {
  const [body, setBody] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!ticketId) {
      setError('Se requiere el ID del ticket para publicar un comentario');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const { supabase } = await import('@/lib/supabaseClient');
      const { data, error } = await supabase.from('comments').insert({
        ticket_id: ticketId,
        body,
        created_at: new Date().toISOString()
      });
      if (error) {
        setError(error.message);
      } else {
        setBody('');
      }
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col lg:col-span-1">
      <h3 className="font-bold text-slate-800 text-base mb-4 flex items-center gap-2">
        <MessageSquare className="text-cyan-600" size={18} />
        Comentarios
      </h3>
      {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
      <form className="space-y-4 flex-1 flex flex-col justify-between" onSubmit={handleSubmit}>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Comentario</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              placeholder="Agrega una nota o actualización sobre el ticket..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-cyan-500 resize-none"
              required
            ></textarea>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-[#1d2d5b] text-white py-2.5 px-4 rounded-lg font-medium text-sm hover:bg-slate-800 transition-colors shadow-sm mt-4"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Publicando...' : 'Publicar Comentario'}
        </button>
      </form>
    </div>
  );
}