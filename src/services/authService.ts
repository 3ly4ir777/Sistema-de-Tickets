import { supabase } from '../lib/supabaseClient';

export async function loginApi(email: string, password: string) {
  // 1. Autenticar en Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError || !authData.user) {
    throw new Error(authError?.message || 'Error de autenticación');
  }

  // 2. Traer el rol y nombre desde nuestra tabla custom de 'users'
  const { data: profileData, error: profileError } = await supabase
    .from('users')
    .select('id, name, email, role')
    .eq('id', authData.user.id)
    .single();

  if (profileError || !profileData) {
    throw new Error('No se encontró el perfil de usuario asignado');
  }

  return profileData; // Retorna id, name, email, role
}

export async function checkMeApi() {
  // Verificamos si hay sesión activa en el navegador
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return null;

  // Si hay sesión, traemos los datos de la tabla 'users'
  const { data: profileData } = await supabase
    .from('users')
    .select('id, name, email, role')
    .eq('id', session.user.id)
    .single();

  return profileData || null;
}

export async function logoutApi() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}