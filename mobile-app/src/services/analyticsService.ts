import { supabase } from './supabase';

type ComplaintStatus = {
  status: string;
};

export async function fetchDashboardStats() {
  const { data, error } =
    await supabase
      .from('complaints')
      .select('status');

  if (error) {
    throw error;
  }

  const complaints =
    (data as ComplaintStatus[]) || [];

  const total =
    complaints.length;

  const resolved =
    complaints.filter(
      (item) =>
        item.status ===
        'resolved'
    ).length;

  const inProgress =
    complaints.filter(
      (item) =>
        item.status ===
        'in_progress'
    ).length;

  const pending =
  complaints.filter(
    (item) =>
      !item.status ||
      item.status ===
        'open' ||
      item.status ===
        'pending_ai'
    ).length;

  return {
    total,
    resolved,
    inProgress,
    pending,
  };
}