import { currentUser } from '@/actions/current-user';
import { getOverallStats } from '@/actions/get-overall-stats';
import { getChurchBranches } from '@/actions/getChurchBranches';

import { getChurches } from '@/actions/getChurches';
import {
  HomePage,
  ChurchAdminHomePage,
  BranchLeaderHomePage,
} from '@/components/home-page';
import { RoleEnum, UserProfile } from '@/types/user.type';
import { verifyUserHasOnboarded } from './util';
import { use } from 'react';
import SvgIcon from '@/components/svg-icon';
import { redirect } from 'next/navigation';
import { getTeamMembers } from '@/actions/getUsers';

export type ChurchRow = {
  name: string;
  churchOwner: string;
  branches: string;
  status: string;
};

async function renderGospoolAdminView(user: UserProfile) {
  const [churches, stats] = await Promise.all([
    getChurches(),
    getOverallStats(),
  ]);

  if (!churches.success) {
    return [];
  }

  return (
    <HomePage
      user={{ user: { firstName: user.firstName, lastName: user.lastName } }}
      churchData={churches.data}
      totalChurches={stats.data?.churches || 0}
      totalRides={stats.data?.rides || 0}
      totalDrivers={stats.data?.drivers || 0}
      totalPassengers={stats.data?.passengers || 0}
    />
  );
}

async function renderChurchAdminView(user: UserProfile) {
  if (!user.church?.churchId) {
    return (
      <div>
        <div className="w-full md:mt-5.75">
          <div className="xsm:flex justify-between items-center">
            <div>
              <h1 className="text-xl font-medium mb-2 md:text-3xl">
                Welcome,
                <span className="capitalize">{` ${user?.firstName} ${user?.lastName}`}</span>
              </h1>
              <p className="text-gray-500 text-xs md:text-base">
                Owner - Gospool
              </p>
            </div>
          </div>
        </div>

        <div className="dashboard-card p-10 flex flex-col items-center justify-center mt-8 gap-4">
          <div className="bg-red-100 inline-block p-4 rounded-full">
            <SvgIcon name="church" className="w-8 h-8 text-red-500" />
          </div>
          <span className="text-lg font-medium">
            No church assigned to you yet.
          </span>
          {/* <Button
            type="button"
            className="block capitalize mb-2 mt-8 ml-auto xsm:m-0"
            // onClick={() => redirect('/create-church-profile')}
          >
            Complete Church Profile
          </Button> */}
        </div>
      </div>
    );
  }

  const [branches, stats] = await Promise.all([
    getChurchBranches(user.church?.churchId || ''),
    getOverallStats(),
  ]);

  return (
    <ChurchAdminHomePage
      user={{ user: { firstName: user.firstName, lastName: user.lastName } }}
      branchData={branches.data || []}
      totalBranches={stats.data?.churches || 0}
      totalRides={stats.data?.rides || 0}
      totalDrivers={stats.data?.drivers || 0}
      totalPassengers={stats.data?.passengers || 0}
    />
  );
}

async function renderBranchLeaderView(user: UserProfile) {
  const [teamMembers, stats] = await Promise.all([
    getTeamMembers(user.branch?.branchId || ''),
    getOverallStats(),
  ]);

  if (!teamMembers.success) {
    return [];
  }

  return (
    <BranchLeaderHomePage
      user={{ user: { firstName: user.firstName, lastName: user.lastName } }}
      teamsData={teamMembers.data || []}
      totalChurches={stats.data?.churches || 0}
      totalRides={stats.data?.rides || 0}
      totalDrivers={stats.data?.drivers || 0}
      totalPassengers={stats.data?.passengers || 0}
    />
  );
}

export default function Page() {
  const user = use(currentUser());
  // const router = useRouter();

  if (!user.success || !user.user) {
    return null;
  }

  const userRoles = user?.user?.roles || [];
  const onboarded = verifyUserHasOnboarded(user.user);

  if (!onboarded.onboardingComplete) {
    redirect(onboarded.onboardingUrl);
  }

  if (userRoles.includes(RoleEnum.GOSPOOL_ADMIN)) {
    return renderGospoolAdminView(user.user);
  }

  if (userRoles.includes(RoleEnum.CHURCH_ADMIN)) {
    return renderChurchAdminView(user.user);
  }

  if (userRoles.includes(RoleEnum.BRANCH_LEADER)) {
    return renderBranchLeaderView(user.user);
  }

  return renderChurchAdminView(user.user);
}
