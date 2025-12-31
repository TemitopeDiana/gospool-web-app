import { Metadata } from 'next';

import Breadcrumb from '@/components/bread-crumbs';

import { getChurchStats } from '@/actions/get-church-stats';
import { getChurchBranches } from '@/actions/getChurchBranches';
import { getChurchById } from '@/actions/getChurchById';
import { getChurchDrivers } from '@/actions/getChurchDrivers';
import { getChurchPassengers } from '@/actions/getChurchPassengers';
import { getChurchTeamMembers } from '@/actions/getChurchTeamMembers';
import ChurchProfile from '@/components/church-profile';
import { routes } from '@/lib/routes';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { churchId } = await params;
  const church = await getChurchById(churchId);

  return {
    title: church.data?.name ?? undefined,
  };
}

type Props = {
  params: Promise<{ churchId: string }>;
};

const ChurchPage = async ({ params }: Props) => {
  const { churchId } = await params;

  const [church, branches, passengers, drivers, stats, teamMembers] =
    await Promise.all([
      getChurchById(churchId),
      getChurchBranches(churchId),
      getChurchPassengers(churchId),
      getChurchDrivers(churchId),
      getChurchStats(churchId),
      getChurchTeamMembers(churchId),
    ]);

  if (!church.data) {
    return notFound();
  }

  return (
    <div>
      <Breadcrumb
        items={[
          { label: 'Churches', href: routes.home() },
          { label: church.data?.name || 'Church' },
        ]}
      />

      <ChurchProfile
        branches={branches.data ?? []}
        passengers={passengers.data ?? []}
        drivers={drivers.data ?? []}
        teamMembers={teamMembers.data || []}
        churchName={church.data?.name ?? ''}
        adminName={church.data?.adminName ?? ''}
        totalBranches={church.data?.totalBranches ?? 0}
        churchId={churchId}
        totalDrivers={stats.data?.drivers || 0}
        totalPassengers={stats.data?.passengers || 0}
        totalTeam={stats.data?.team || 0}
        churchLogo={church.data?.logo}
        adminAvatar={church.data?.adminAvatar}
      />
    </div>
  );
};

export default ChurchPage;
