import { notFound } from 'next/navigation';

import BranchPage from '@/components/branch-page';
import Breadcrumb from '@/components/bread-crumbs';

import { getChurchBranchServices } from '@/actions/get-church-branch-services';
import { getChurchBranchStats } from '@/actions/get-church-branch-stats';
import { getChurchBranchById } from '@/actions/getChurchBranchById';
import { getChurchBranchDrivers } from '@/actions/getChurchBranchDrivers';
import { getChurchBranchPassengers } from '@/actions/getChurchBranchPassengers';
import { getChurchBranchTeamMembers } from '@/actions/getChurchBranchTeamMembers';
import { routes } from '@/lib/routes';
import { getChurchLogo } from '@/actions/get-church-logo';

type Props = {
  params: Promise<{ branchId: string }>;
};

const ChurchBranchPage = async ({ params }: Props) => {
  const { branchId } = await params;

  const [branchInfo, stats, drivers, passengers, teamMembers, services] =
    await Promise.all([
      getChurchBranchById(branchId),
      getChurchBranchStats(branchId),
      getChurchBranchDrivers(branchId),
      getChurchBranchPassengers(branchId),
      getChurchBranchTeamMembers(branchId),
      getChurchBranchServices(branchId),
    ]);

  if (!branchInfo.success) {
    return notFound();
  }

  const churchLogo = await getChurchLogo(branchInfo.data?.churchId as string);

  return (
    <div>
      <Breadcrumb
        items={[
          {
            label: 'Churches',
            href: routes.churchProfile(branchInfo.data?.churchId ?? '#'),
          },
          { label: branchInfo.data?.name || 'Branch' },
        ]}
      />

      <BranchPage
        teamMembers={teamMembers.data || []}
        drivers={drivers.data || []}
        passengers={passengers.data || []}
        churchName={branchInfo.data?.name ?? 'Hello'}
        churchAddress={branchInfo.data?.address ?? 'SWorld'}
        churchAdmin={`${branchInfo.data?.leader.lastName} ${branchInfo.data?.leader.firstName}`}
        totalDrivers={stats.data?.drivers || 0}
        churchLogo={churchLogo.logoUrl}
        totalPassengers={stats.data?.passengers || 0}
        totalTeam={stats.data?.team || 0}
        branchId={branchId}
        services={services.data?.services || []}
        adminAvatar={branchInfo.data?.leader.avatar}
      />
    </div>
  );
};

export default ChurchBranchPage;
