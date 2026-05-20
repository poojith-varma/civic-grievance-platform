import { supabase } from './supabase';

export async function getProfile() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error(
      'User not found'
    );
  }

  const { data, error } =
    await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateProfile(
  updates: any
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error(
      'User not found'
    );
  }

  const { data, error } =
    await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        ...updates,
      })
      .select()
      .single();

  if (error) {
    throw error;
  }

  return data;
}