import { Metadata } from 'next';

import { getChurchBranches } from '@/actions/getChurchBranches';
import { getChurch } from '@/actions/getChurch';
import ChurchProfile from '@/components/church-profile';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { uniqueIdentifier } = await params;
  const church = await getChurch(uniqueIdentifier);

  return {
    title: church.data?.name ?? undefined,
  };
}

type Props = {
  params: Promise<{ uniqueIdentifier: string }>;
};

const ChurchPage = async ({ params }: Props) => {
  const { uniqueIdentifier } = await params;

  const [church, branches] = await Promise.all([
    getChurch(uniqueIdentifier),
    await getChurchBranches(),
  ]);

  if (!church.success) {
    return notFound();
  }

  return (
    <>
      <ChurchProfile
        branches={branches.data ?? []}
        churchName={church.data?.name ?? ''}
        adminName={church.data?.adminName ?? ''}
        totalBranches={church.data?.totalBranches ?? 0}
        churchId={uniqueIdentifier}
      />
    </>
  );
};

export default ChurchPage;
