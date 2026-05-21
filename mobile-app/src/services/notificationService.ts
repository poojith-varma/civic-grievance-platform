import { supabase } from './supabase';

export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type: string
) {
  const { error } =
    await supabase
      .from('notifications')
      .insert([
        {
          user_id: userId,
          title,
          message,
          type,
        },
      ]);

  if (error) {
    console.log(
      'Notification Error:',
      error
    );
  }
}

export async function fetchNotifications() {
  const {
    data: sessionData,
  } =
    await supabase.auth.getUser();

  const user =
    sessionData.user;

  if (!user) {
    throw new Error(
      'User not authenticated'
    );
  }

  const { data, error } =
    await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', {
        ascending: false,
      });

  if (error) {
    throw error;
  }

  return data;
}

export async function markNotificationRead(
  notificationId: string
) {
  const { error } =
    await supabase
      .from('notifications')
      .update({
        read: true,
      })
      .eq('id', notificationId);

  if (error) {
    throw error;
  }
}

export async function getUnreadCount() {
  const {
    data: sessionData,
  } =
    await supabase.auth.getUser();

  const user =
    sessionData.user;

  if (!user) {
    return 0;
  }

  const { count, error } =
    await supabase
      .from('notifications')
      .select('*', {
        count: 'exact',
        head: true,
      })
      .eq('user_id', user.id)
      .eq('read', false);

  if (error) {
    return 0;
  }

  return count || 0;
}