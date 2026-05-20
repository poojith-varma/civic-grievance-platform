import { supabase } from './supabase';

export async function updateComplaintStatus(
  complaintId: string,
  status: string,
  completionImage?: string
) {
  const updates: any = {
    status,
  };

  if (completionImage) {
    updates.completion_image =
      completionImage;
  }

  const { data, error } =
    await supabase
      .from('complaints')
      .update(updates)
      .eq('id', complaintId)
      .select()
      .single();

  if (error) {
    throw error;
  }

  return data;
}