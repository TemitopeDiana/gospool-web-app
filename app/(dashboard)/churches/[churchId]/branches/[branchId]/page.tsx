import { notFound } from 'next/navigation';

import BranchPage from '@/components/branch-page';
import Breadcrumb from '@/components/bread-crumbs';

import { getChurchBranchServices } from '@/actions/get-church-branch-services';
import { getChurchBranchStats } from '@/actions/get-church-branch-stats';
import { getChurchBranchDepartments } from '@/actions/get-church-departments';
import { getChurchLogo } from '@/actions/get-church-logo';
import { getChurchBranchById } from '@/actions/getChurchBranchById';
import { getChurchBranchDrivers } from '@/actions/getChurchBranchDrivers';
import { getChurchBranchPassengers } from '@/actions/getChurchBranchPassengers';
import { getChurchBranchTeamMembers } from '@/actions/getChurchBranchTeamMembers';
import { routes } from '@/lib/routes';

type Props = {
  params: Promise<{ branchId: string }>;
};

const ChurchBranchPage = async ({ params }: Props) => {
  const { branchId } = await params;

  const [
    branchInfo,
    stats,
    drivers,
    passengers,
    teamMembers,
    services,
    departments,
  ] = await Promise.all([
    getChurchBranchById(branchId),
    getChurchBranchStats(branchId),
    getChurchBranchDrivers(branchId),
    getChurchBranchPassengers(branchId),
    getChurchBranchTeamMembers(branchId),
    getChurchBranchServices(branchId),
    getChurchBranchDepartments(branchId),
  ]);

  console.log('Departments', departments.data);

  if (!branchInfo.success) {
    return notFound();
  }

  const churchLogo = await getChurchLogo(branchInfo.data?.churchId as string);

  const leaderInfo = branchInfo.data?.leader;

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
        churchAdmin={
          leaderInfo
            ? `${leaderInfo.lastName} ${leaderInfo.firstName}`
            : 'Not assigned'
        }
        totalDrivers={stats.data?.drivers || 0}
        churchLogo={churchLogo.logoUrl}
        totalPassengers={stats.data?.passengers || 0}
        totalTeam={stats.data?.team || 0}
        branchId={branchId}
        services={services.data?.services || []}
        adminAvatar={leaderInfo?.avatar}
        departments={departments.data || []}
      />
    </div>
  );
};

export default ChurchBranchPage;
