import React, { FormEvent } from 'react';
import { MessageSquare } from 'lucide-react';

export default function CommentForm() {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Tu lógica de conexión a API o backend aquí
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col lg:col-span-1">
      <h3 className="font-bold text-slate-800 text-base mb-4 flex items-center gap-2">
        <MessageSquare className="text-cyan-600" size={18} />
        Formulario de Comentarios / SLA
      </h3>
      <form className="space-y-4 flex-1 flex flex-col justify-between" onSubmit={handleSubmit}>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">ID del Ticket</label>
            <input 
              type="text" 
              placeholder="Ej. TKT-3899" 
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Estatus del Ticket</label>
            <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-cyan-500 bg-white">
              <option>Bajo revisión (Inprog)</option>
              <option>Pendiente de SLA (Pending)</option>
              <option>Cerrado con Éxito (Closed)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Comentarios de Resolución</label>
            <textarea 
              rows={4} 
              placeholder="Agrega anotaciones sobre la solución aplicada..." 
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-cyan-500 resize-none"
            ></textarea>
          </div>
        </div>
        <button 
          type="submit" 
          className="w-full bg-[#1d2d5b] text-white py-2.5 px-4 rounded-lg font-medium text-sm hover:bg-slate-800 transition-colors shadow-sm mt-4"
        >
          Postear Comentario
        </button>
      </form>
    </div>
  );
}