import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Si están vacías, ponemos un aviso claro en la consola para saber qué pasa
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("🚨 Error: Las variables de entorno de Supabase no están cargadas en el cliente.");
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', // Evita que explote el constructor si viene vacío
  supabaseAnonKey || 'placeholder-key'
);