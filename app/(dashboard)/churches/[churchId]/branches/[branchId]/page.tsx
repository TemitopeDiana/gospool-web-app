import { getChurchBranchById } from '@/actions/getChurchBranchById';
import BranchPage from '@/components/branch-page';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ branchId: string }>;
};

const ChurchBranchPage = async ({ params }: Props) => {
  const branchId = (await params).branchId;

  const branchInfo = await getChurchBranchById(branchId);

  if (!branchInfo.success) {
    return notFound();
  }

  return (
    <div>
      <BranchPage
        branches={[]}
        churchName={branchInfo.data?.name ?? 'Hello'}
        churchAddress={branchInfo.data?.address ?? 'SWorld'}
        churchAdmin={`${branchInfo.data?.leaderId.lastName} ${branchInfo.data?.leaderId.firstName}`}
      />
    </div>
  );
};

export default ChurchBranchPage;
