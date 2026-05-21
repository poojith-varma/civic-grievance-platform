import { supabase } from './supabase';

type Complaint = {
  status: string;
  area?: string | null;
  assigned_worker_id?: string | null;
  created_at?: string;
};

export async function fetchDashboardStats() {
  const { data, error } =
    await supabase
      .from('complaints')
      .select(
        `
        status,
        area,
        assigned_worker_id,
        created_at
      `
      );

  if (error) {
    throw error;
  }

  const complaints =
    (data as Complaint[]) || [];

  // ✅ TOTAL
  const total =
    complaints.length;

  // ✅ RESOLVED
  const resolved =
    complaints.filter(
      (item) =>
        item.status ===
        'resolved'
    ).length;

  // ✅ REJECTED
  const rejected =
    complaints.filter(
      (item) =>
        item.status ===
        'rejected'
    ).length;

  // ✅ ACTIVE
  const active =
    complaints.filter(
      (item) =>
        item.status ===
          'assigned' ||
        item.status ===
          'in_progress'
    ).length;

  // ✅ VERIFICATION PENDING
  const verificationPending =
    complaints.filter(
      (item) =>
        item.status ===
        'verification_pending'
    ).length;

  // ✅ PENDING
  const pending =
    complaints.filter(
      (item) =>
        !item.status ||
        item.status ===
          'open' ||
        item.status ===
          'pending' ||
        item.status ===
          'pending_ai'
    ).length;

  // ✅ RESOLUTION RATE
  const resolutionRate =
    total > 0
      ? Math.round(
          (resolved /
            total) *
            100
        )
      : 0;

  // ✅ AREA ANALYTICS
  const areaMap:
    Record<
      string,
      number
    > = {};

  complaints.forEach(
    (item) => {
      const area =
        item.area &&
        item.area !==
          'Unknown'
          ? item.area
          : null;

      if (!area) return;

      areaMap[area] =
        (areaMap[area] ||
          0) + 1;
    }
  );

  let topArea =
    'No Data';

  let topAreaCount = 0;

  Object.entries(
    areaMap
  ).forEach(
    ([area, count]) => {
      if (
        count >
        topAreaCount
      ) {
        topArea = area;
        topAreaCount =
          count;
      }
    }
  );

  // ✅ WORKER PERFORMANCE
  const workerMap:
    Record<
      string,
      number
    > = {};

  complaints.forEach(
    (item) => {
      if (
        item.status ===
          'resolved' &&
        item.assigned_worker_id
      ) {
        const workerId =
          item.assigned_worker_id;

        workerMap[
          workerId
        ] =
          (workerMap[
            workerId
          ] || 0) + 1;
      }
    }
  );

  const topWorkerCount =
    Math.max(
      ...Object.values(
        workerMap
      ),
      0
    );

  // ✅ MONTHLY TREND DATA
  const monthlyMap:
    Record<
      string,
      number
    > = {
      Jan: 0,
      Feb: 0,
      Mar: 0,
      Apr: 0,
      May: 0,
      Jun: 0,
      Jul: 0,
      Aug: 0,
      Sep: 0,
      Oct: 0,
      Nov: 0,
      Dec: 0,
    };

  complaints.forEach(
    (item) => {
      if (
        !item.created_at
      ) {
        return;
      }

      const date =
        new Date(
          item.created_at
        );

      const month =
        date.toLocaleString(
          'default',
          {
            month:
              'short',
          }
        );

      if (
        monthlyMap[
          month
        ] !== undefined
      ) {
        monthlyMap[
          month
        ] += 1;
      }
    }
  );

  const trendLabels =
    Object.keys(
      monthlyMap
    );

  const trendData =
    Object.values(
      monthlyMap
    );

  // ✅ STATUS BREAKDOWN
  const statusBreakdown =
    [
      {
        label:
          'Resolved',
        value:
          resolved,
        color:
          '#22C55E',
      },

      {
        label:
          'Active',
        value:
          active,
        color:
          '#F59E0B',
      },

      {
        label:
          'Rejected',
        value:
          rejected,
        color:
          '#EF4444',
      },

      {
        label:
          'Pending',
        value:
          pending,
        color:
          '#4F7CFF',
      },
    ];

  // ✅ AREA DISTRIBUTION
  const areaDistribution =
    Object.entries(
      areaMap
    )
      .map(
        ([area, count]) => ({
          area,
          count,
        })
      )
      .sort(
        (a, b) =>
          b.count -
          a.count
      )
      .slice(0, 5);

  return {
    total,
    resolved,
    rejected,
    active,
    pending,

    inProgress:
      active,

    verificationPending,

    resolutionRate,

    topArea,
    topAreaCount,

    topWorkerCount,

    trendLabels,
    trendData,

    statusBreakdown,

    areaDistribution,
  };
}