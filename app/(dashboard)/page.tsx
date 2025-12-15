import { currentUser } from '@/actions/current-user';
import { getOverallStats } from '@/actions/get-overall-stats';

import { getChurches } from '@/actions/getChurches';
import HomePage from '@/components/home-page';

export type ChurchRow = {
  name: string;
  churchOwner: string;
  branches: string;
  status: string;
};

export default async function Page() {
  const [user, churches, stats] = await Promise.all([
    currentUser(),
    getChurches(),
    getOverallStats(),
  ]);

  if (!churches.success) {
    return [];
  }

  return (
    <HomePage
      user={user}
      churchData={churches.data}
      totalChurches={stats.data?.churches || 0}
      totalRides={stats.data?.rides || 0}
      totalDrivers={stats.data?.drivers || 0}
      totalPassengers={stats.data?.passengers || 0}
    />
  );
}
