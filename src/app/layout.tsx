import { AuthProvider } from '@/context/AuthContext';
import './globals.css'; // Tus estilos de Tailwind

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}