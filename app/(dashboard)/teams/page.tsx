import { currentUser } from '@/actions/current-user';
import { getOverallStats } from '@/actions/get-overall-stats';

import { getTeamMembers } from '@/actions/getUsers';
import { TeamsPage } from '@/components/teams-page';

export type ChurchRow = {
  name: string;
  churchOwner: string;
  branches: string;
  status: string;
};


export default async function Page() {
  const user = await currentUser();
  // const router = useRouter();

  if (!user.success || !user.user) {
    return null;
  }

  const [teamMembers, stats] = await Promise.all([
    getTeamMembers(user.user?.branch?.branchId || ''),
    getOverallStats(),
  ]);

  return (
    <TeamsPage
      user={{ user: { firstName: user.user?.firstName, lastName: user.user?.lastName } }}
      teamsData={teamMembers.data || []}
      totalChurches={stats.data?.churches || 0}
      totalRides={stats.data?.rides || 0}
      totalDrivers={stats.data?.drivers || 0}
      totalPassengers={stats.data?.passengers || 0}
    />
  );
}
