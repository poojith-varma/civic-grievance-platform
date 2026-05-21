import { supabase } from './supabase';

import {
  createNotification,
} from './notificationService';

// ✅ FETCH WORKERS BY AREA
export async function fetchWorkersByArea(
  area: string
) {
  // GET WORKERS
  const {
    data: workers,
    error,
  } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'worker')
    .eq('area', area);

  if (error) {
    throw error;
  }

  // ADD WORKLOAD COUNT
  const workersWithLoad =
    await Promise.all(
      (workers || []).map(
        async (worker) => {
          const {
            count,
          } = await supabase
            .from(
              'complaints'
            )
            .select('*', {
              count:
                'exact',
              head: true,
            })
            .eq(
              'assigned_worker_id',
              worker.id
            )
            .neq(
              'status',
              'resolved'
            )
            .neq(
              'status',
              'rejected'
            );

          return {
            ...worker,

            activeTasks:
              count || 0,
          };
        }
      )
    );

  return workersWithLoad;
}

// ✅ ASSIGN WORKER
export async function assignWorker(
  complaintId: string,
  workerId: string
) {
  // UPDATE COMPLAINT
  const { data, error } =
    await supabase
      .from('complaints')
      .update({
        assigned_worker_id:
          workerId,

        status:
          'assigned',
      })
      .eq('id', complaintId)
      .select()
      .single();

  if (error) {
    throw error;
  }

  // ✅ GET WORKER INFO
  const {
    data: worker,
  } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', workerId)
    .single();

  // ✅ NOTIFY CITIZEN
  if (data?.citizen_id) {
    await createNotification(
      data.citizen_id,

      '👷 Worker Assigned',

      `Your complaint "${data.title}" has been assigned to a worker.`,

      'assignment'
    );
  }

  // ✅ NOTIFY WORKER
  if (worker?.id) {
    await createNotification(
      worker.id,

      '📦 New Task Assigned',

      `You have been assigned a new complaint: "${data.title}".`,

      'assignment'
    );
  }

  return data;
}