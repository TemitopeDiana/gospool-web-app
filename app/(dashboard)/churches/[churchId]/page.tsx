import { Metadata } from 'next';

import Breadcrumb from '@/components/bread-crumbs';

import { getChurchBranches } from '@/actions/getChurchBranches';
import { getChurchById } from '@/actions/getChurchById';
import { getChurchDrivers } from '@/actions/getChurchDrivers';
import { getChurchPassengers } from '@/actions/getChurchPassengers';
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

  const [church, branches, passengers, drivers] = await Promise.all([
    getChurchById(churchId),
    getChurchBranches(churchId),
    await getChurchPassengers(churchId),
    await getChurchDrivers(churchId),
  ]);

  if (!church.success) {
    return notFound();
  }

  console.log({ church });

  console.log('Passengers', { passengers });

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
        churchName={church.data?.name ?? ''}
        adminName={church.data?.adminName ?? ''}
        totalBranches={church.data?.totalBranches ?? 0}
        churchId={churchId}
      />
    </div>
  );
};

export default ChurchPage;
