import { supabase } from './database';

export async function signUp(email: string, password: string, display_name: string) {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    throw new Error(authError.message);
  }

  const userId = authData.user?.id;

  const { error: insertError } = await supabase.from('users').insert([
    {
      id: userId,
      email,
      display_name,
      created_at: new Date().toISOString(),
      is_private: 0
    }
  ]);

  if (insertError) {
    throw new Error(insertError.message);
  }

  return userId;
}

export async function logIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data.user;
}
