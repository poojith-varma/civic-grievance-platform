import { supabase } from './supabase';

export async function updateComplaintStatus(
  complaintId: string,
  status: string
) {
  const { data, error } =
    await supabase
      .from('complaints')
      .update({
        status,
      })
      .eq('id', complaintId)
      .select()
      .single();

  if (error) {
    throw error;
  }

  return data;
}