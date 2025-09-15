import { currentUser } from '@/actions/current-user';

import { getChurches } from '@/actions/getChurches';
import HomePage from '@/components/home-page';

export type ChurchRow = {
  name: string;
  churchOwner: string;
  branches: string;
  status: string;
};

export default async function Page() {
  const [user, churches] = await Promise.all([currentUser(), getChurches()]);

  if (!churches.success) {
    return [];
  }

  return (
    <HomePage
      user={user}
      churchData={churches.data}
      totalChurches={churches.pagination.total}
      totalRides={0}
      totalDrivers={0}
      totalPassengers={0}
    />
  );
}
