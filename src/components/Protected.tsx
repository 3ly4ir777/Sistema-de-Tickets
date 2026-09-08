'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface ProtectedProps {
  children: React.ReactNode;
  allowedRoles?: ('administrador' | 'encargado_sistemas' | 'usuario')[];
}

export default function Protected({ children, allowedRoles }: ProtectedProps) {
  const { user, loading } = useAuth(); // 💡 Asegúrate de que useAuth devuelva el rol dentro de user (ej. user.role)
  const router = useRouter();

  React.useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (allowedRoles && !allowedRoles.includes(user.role as any)) {
        // 🚫 Si está logueado pero no tiene el rol permitido, redirigir a su página correspondiente
        if (user.role === 'usuario') {
          router.push('/portal-usuario');
        } else {
          router.push('/tickets'); // Ruta para administradores/sistemas
        }
      }
    }
  }, [loading, user, router, allowedRoles]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin" />
          <div className="text-sm font-medium text-slate-500">Verificando credenciales...</div>
        </div>
      </div>
    );
  }

  // Si no hay usuario o el rol no coincide, no renderiza nada mientras redirige
  if (!user) return null;
  if (allowedRoles && !allowedRoles.includes(user.role as any)) return null;

  return <>{children}</>;
}