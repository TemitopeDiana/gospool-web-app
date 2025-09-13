import { Metadata } from 'next';

import ChurchProfile from '../churchProfile';

import { Branch } from '@/types/church.type';

// NO "use client" here — this is a Server Component.
export const metadata: Metadata = {
  title: 'Church profile',
};

// const branchData: any[] =[]

// Example server-side fetching (replace with your real server fetch/action)
async function getBranches(): Promise<Branch[]> {
  // do server-side fetch / database call here
  return [
    { date: '12/01/25', name: 'cci yaba', status: 'active' },
    { date: '6/04/25', name: 'cci ikeja', status: 'active' },
  ];
}

export default async function Page() {
  const branches = await getBranches();

  // Only pass serializable props (no functions).
  return <ChurchProfile initialBranches={branches} />;
}
