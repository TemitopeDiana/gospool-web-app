import type { IconName } from '@/types/icon.type';
import BranchPage from './branchPage';

type Branch = {
  date: string;
  name: string;
  avatar?: string;
  email?: string;
  department?: string;
};

const branchData: Branch[] = [
  {
    date: '12/01/25',
    name: 'cci yaba',
    avatar: '/assets/profile-pic.png',
    email: 'gbenbaggsb23@gmail.com',
    department: 'media',
  },
  {
    date: '6/04/25',
    name: 'cci ikeja',
    avatar: '/assets/profile-pic.png',
    email: 'gbenbaggsb23@gmail.com',
    department: 'greeters',
  },
];

const cards = [
  { name: 'drivers', iconName: 'car' as IconName, team: 100 },
  { name: 'members', iconName: 'profile-users' as IconName, team: 1000 },
  { name: 'team', iconName: 'profile-users' as IconName, team: 100 },
];

const displayData = ['passengers', 'drivers', 'team'];

export default async function Page() {
  // Replace these with server fetches as needed (DB / API calls).
  const initialBranches = branchData;
  const initialCards = cards;
  const initialDisplayData = displayData;

  return (
    // pass only serializable props (strings, arrays, objects)
    <BranchPage
      initialBranches={initialBranches}
      initialCards={initialCards}
      initialDisplayData={initialDisplayData}
    />
  );
}
