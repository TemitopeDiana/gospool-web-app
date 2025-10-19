import { Metadata } from 'next';

import { getChurchBranches } from '@/actions/getChurchBranches';
import { getChurchById } from '@/actions/getChurchById';
import ChurchProfile from '@/components/church-profile';
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

  const [church, branches] = await Promise.all([
    getChurchById(churchId),
    await getChurchBranches(churchId),
  ]);

  if (!church.success) {
    return notFound();
  }

  return (
    <ChurchProfile
      branches={branches.data ?? []}
      churchName={church.data?.name ?? ''}
      adminName={church.data?.adminName ?? ''}
      totalBranches={church.data?.totalBranches ?? 0}
      churchId={churchId}
    />
  );
};

export default ChurchPage;
