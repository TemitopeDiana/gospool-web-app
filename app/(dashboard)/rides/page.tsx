import { Metadata } from 'next';

import RidesMonitoring from '@/components/rides-monitoring';
import { getRides } from '@/actions/getRides';

export const metadata: Metadata = {
  title: 'Rides',
};

export default async function RidesMonitoringPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | undefined>>;
}) {
  const sp = searchParams ? await searchParams : {};
  const status = sp?.status || 'in-progress';
  const page = Number(sp.page ?? 1);
  const limit = Number(sp.limit ?? 10);

  const rides = await getRides({ status, page, limit });
  const ridesArray = rides?.data ?? rides?.data ?? [];

  return <RidesMonitoring rides={ridesArray} initialStatus={status} />;
}
