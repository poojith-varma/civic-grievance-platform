import { supabase } from './supabase';

export async function signUp(
  email: string,
  password: string,
  role: string
) {
  // CREATE AUTH USER
  const { data, error } =
    await supabase.auth.signUp({
      email,
      password,
    });

  if (error) {
    throw error;
  }

  // INSERT PROFILE
  if (data.user) {
    const { error: profileError } =
      await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            email,
            role,
          },
        ]);

    if (profileError) {
      throw profileError;
    }
  }

  return data;
}

export async function signIn(
  email: string,
  password: string
) {
  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (error) {
    throw error;
  }

  return data;
}

export async function signOut() {
  const { error } =
    await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}

export async function getCurrentSession() {
  const { data, error } =
    await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  return data.session;
}