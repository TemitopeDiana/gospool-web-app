import { Metadata } from 'next';

import { getChurchBranches } from '@/actions/getChurchBranches';
import { getChurch } from '@/actions/getChurch';
import ChurchProfile from '@/components/church-profile';

export const metadata: Metadata = {
  title: 'Church profile',
};

type Props = {
  params: Promise<{ uniqueIdentifier: string }>;
};

const ChurchPage = async ({ params }: Props) => {
  const { uniqueIdentifier } = await params;

  const [church, branches] = await Promise.all([
    getChurch(uniqueIdentifier),
    await getChurchBranches(),
  ]);

  return (
    <>
      <ChurchProfile
        branches={branches.data ?? []}
        churchName={church.data?.name ?? ''}
        adminName={church.data?.adminName ?? ''}
        totalBranches={church.data?.totalBranches ?? 0}
      />
    </>
  );
};

export default ChurchPage;
