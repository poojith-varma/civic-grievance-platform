import { supabase } from './supabase';

type CreateComplaintPayload = {
  title: string;
  description: string;
};

export async function createComplaint(
  payload: CreateComplaintPayload
) {
  const {
    data: sessionData,
    error: sessionError,
  } = await supabase.auth.getUser();

  if (sessionError) {
    throw sessionError;
  }

  const user = sessionData.user;

  if (!user) {
    throw new Error(
      'User not authenticated'
    );
  }

  const { data, error } =
    await supabase
      .from('complaints')
      .insert([
        {
          title: payload.title,
          description:
            payload.description,
          citizen_id: user.id,
        },
      ])
      .select()
      .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function fetchComplaints() {
  const { data, error } =
    await supabase
      .from('complaints')
      .select('*')
      .order('created_at', {
        ascending: false,
      });

  if (error) {
    throw error;
  }

  return data;
}