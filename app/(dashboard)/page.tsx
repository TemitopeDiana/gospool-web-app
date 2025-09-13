import { currentUser } from '@/actions/current-user';
import type { IconName } from '@/types/icon.type';

import Home from './home';

export type ChurchRow = {
  name: string;
  churchOwner: string;
  branches: string;
  status: string;
};

const churchData: ChurchRow[] = [
  {
    name: 'apostolic faith',
    churchOwner: 'grace ruth',
    branches: '4',
    status: 'active',
  },
  {
    name: 'apostolic faith',
    churchOwner: 'grace ruth',
    branches: '4',
    status: 'inactive',
  },
  {
    name: 'apostolic faith',
    churchOwner: 'grace ruth',
    branches: '4',
    status: 'active',
  },
  {
    name: 'apostolic faith',
    churchOwner: 'grace ruth',
    branches: '4',
    status: 'inactive',
  },
];

const cards = [
  { name: 'churches', iconName: 'church' as IconName, number: 12 },
  { name: 'Rides', iconName: 'routing' as IconName, number: 9 },
  { name: 'Drivers', iconName: 'car' as IconName, number: 24 },
  { name: 'Passengers', iconName: 'profile' as IconName, number: 3 },
];

export default async function Page() {
  const user = await currentUser();

  return (
    <Home
      initialUser={user ?? null}
      initialCards={cards}
      initialChurchData={churchData}
    />
  );
}
