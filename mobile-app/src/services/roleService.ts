import { supabase } from './supabase';

export async function getUserRole() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } =
    await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

  if (error) {
    console.log(error);

    return null;
  }

  return data.role;
}