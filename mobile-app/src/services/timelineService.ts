import { supabase } from './supabase';

export async function fetchComplaintTimeline(
  complaintId: string
) {
  const { data, error } =
    await supabase
      .from(
        'complaint_timeline'
      )
      .select(`
        *,
        profiles:performed_by (
          name,
          role
        )
      `)
      .eq(
        'complaint_id',
        complaintId
      )
      .order('created_at', {
        ascending: true,
      });

  if (error) {
    throw error;
  }

  return data || [];
}