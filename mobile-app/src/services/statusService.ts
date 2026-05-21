import { supabase } from './supabase';

async function createTimelineEvent(
  complaintId: string,
  action: string
) {
  try {
    const {
      data: sessionData,
    } =
      await supabase.auth.getUser();

    const user =
      sessionData.user;

    await supabase
      .from(
        'complaint_timeline'
      )
      .insert([
        {
          complaint_id:
            complaintId,

          action,

          performed_by:
            user?.id || null,
        },
      ]);
  } catch (error) {
    console.log(
      'Timeline Error:',
      error
    );
  }
}

export async function updateComplaintStatus(
  complaintId: string,
  status: string,
  imageUrl?: string,
  rejectionReason?: string,
  rejectionNotes?: string
) {
  const updateData: any = {
    status,
  };

  // ✅ COMPLETION IMAGE
  if (imageUrl) {
    updateData.completion_image_url =
      imageUrl;
  }

  // ✅ REJECTION DATA
  if (status === 'rejected') {
    updateData.rejection_reason =
      rejectionReason ||
      'No reason provided';

    updateData.rejection_notes =
      rejectionNotes || null;

    updateData.rejected_at =
      new Date().toISOString();
  }

  // ✅ REOPENED
  if (status === 'pending') {
    updateData.reopened_at =
      new Date().toISOString();

    updateData.rejection_reason =
      null;

    updateData.rejection_notes =
      null;
  }

  // ✅ VERIFICATION TIMESTAMP
  if (
    status ===
    'verification_pending'
  ) {
    updateData.verification_submitted_at =
      new Date().toISOString();
  }

  const { data, error } =
    await supabase
      .from('complaints')
      .update(updateData)
      .eq('id', complaintId)
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

  // ✅ TIMELINE EVENTS
  switch (status) {
    case 'assigned':
      await createTimelineEvent(
        complaintId,
        '👷 Worker Assigned'
      );
      break;

    case 'in_progress':
      await createTimelineEvent(
        complaintId,
        '🛠️ Work Started'
      );
      break;

    case 'verification_pending':
      await createTimelineEvent(
        complaintId,
        '📸 Verification Submitted'
      );
      break;

    case 'resolved':
      await createTimelineEvent(
        complaintId,
        '✅ Complaint Resolved'
      );
      break;

    case 'rejected':
      await createTimelineEvent(
        complaintId,
        '❌ Complaint Rejected'
      );
      break;

    case 'pending':
      await createTimelineEvent(
        complaintId,
        '🔄 Complaint Reopened'
      );
      break;
  }

  return data;
}