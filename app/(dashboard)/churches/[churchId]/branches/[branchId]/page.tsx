import { notFound } from 'next/navigation';

import BranchPage from '@/components/branch-page';
import Breadcrumb from '@/components/bread-crumbs';

import { getChurchBranchById } from '@/actions/getChurchBranchById';
import { routes } from '@/lib/routes';

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
      <Breadcrumb
        items={[
          {
            label: 'Branches',
            href: routes.branchPage(
              branchInfo.data?.churchId.churchId ?? '#',
              branchId
            ),
          },
          { label: branchInfo.data?.name || 'Branch' },
        ]}
      />
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
