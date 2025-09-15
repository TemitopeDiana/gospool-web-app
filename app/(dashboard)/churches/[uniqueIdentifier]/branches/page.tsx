import { getChurchBranches } from '@/actions/getChurchBranches';

// const cards = [
//    { name: 'drivers', iconName: 'car' as IconName, team: 100 },
//    { name: 'members', iconName: 'profile-users' as IconName, team: 1000 },
//    { name: 'team', iconName: 'profile-users' as IconName, team: 100 },
// ];

export default async function Page() {
  // const initialCards = cards;
  // const initialDisplayData = displayData;

  const branches = await getChurchBranches();

  console.log('BRANCH DATA', branches);

  return (
    <div>
      {/* <BranchPage
            branches={initialBranches}
            initialCards={initialCards}
            initialDisplayData={initialDisplayData}
            churchName={churchData.data?.name ?? ''}
            churchAddress={churchData.data?.adminEmail ?? ''}
            churchAdmin={churchData.data?.adminName ?? ''}
         /> */}
    </div>
  );
}
