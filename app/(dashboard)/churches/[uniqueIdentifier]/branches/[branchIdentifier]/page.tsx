import BranchPage from '@/components/branch-page';

import { getChurchBranches } from '@/actions/getChurchBranches';

const ChurchBranchPage = async () => {
  const branches = await getChurchBranches();

  return (
    <div>
      <BranchPage
        branches={branches.data ?? []}
        churchName={''}
        churchAddress={''}
        churchAdmin={''}
      />
    </div>
  );
};

export default ChurchBranchPage;
