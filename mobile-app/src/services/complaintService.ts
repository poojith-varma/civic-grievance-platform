import { supabase } from './supabase';

import {
  getUserRole,
} from './roleService';

import {
  detectArea,
} from '../utils/detectArea';

type CreateComplaintPayload = {
  title: string;
  description: string;
  image_url?: string | null;
  latitude?: number | null;
  longitude?: number | null;
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

  // ✅ AUTO DETECT AREA
  const detectedArea =
    payload.latitude &&
    payload.longitude
      ? detectArea(
          payload.latitude,
          payload.longitude
        )
      : 'Unknown';

  const { data, error } =
    await supabase
      .from('complaints')
      .insert([
        {
          title: payload.title,

          description:
            payload.description,

          image_url:
            payload.image_url || null,

          latitude:
            payload.latitude || null,

          longitude:
            payload.longitude || null,

          citizen_id: user.id,

          area:
            detectedArea,
        },
      ])
      .select(`
        *,
        profiles:citizen_id (
          name
        )
      `)
      .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function fetchComplaints() {
  // ✅ CURRENT USER
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

  // ✅ GET ROLE
  const role =
    await getUserRole();

  // ✅ BASE QUERY
  let query = supabase
    .from('complaints')
    .select(`
      *,
      profiles:citizen_id (
        name
      )
    `)
    .order('created_at', {
      ascending: false,
    });

  // 👤 CITIZEN
  if (role === 'citizen') {
    query = query.eq(
      'citizen_id',
      user.id
    );
  }

  // 👷 WORKER
if (role === 'worker') {

  // ONLY ASSIGNED COMPLAINTS
  query = query.eq(
    'assigned_worker_id',
    user.id
  );
}

  // 👑 ADMIN SEES EVERYTHING

  const { data, error } =
    await query;

  if (error) {
    console.log(error);

    throw error;
  }

  return data;
}