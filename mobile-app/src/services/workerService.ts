import { supabase } from './supabase';

export async function fetchWorkers() {
  const { data, error } =
    await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'worker');

  if (error) {
    throw error;
  }

  return data;
}

export async function assignWorker(
  complaintId: string,
  workerId: string
) {
  const { data, error } =
    await supabase
      .from('complaints')
      .update({
        assigned_worker:
          workerId,
      })
      .eq('id', complaintId)
      .select()
      .single();

  if (error) {
    throw error;
  }

  return data;
}