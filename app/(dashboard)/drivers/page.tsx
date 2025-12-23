import { Metadata } from 'next';

import DriversPageComponent from '@/components/drivers-page';
import { currentUser } from '@/actions/current-user';
import { getDrivers } from '@/actions/getDrivers';
import { getDriverReturnTypes } from '@/actions/getDriverReturnTypes';

export const metadata: Metadata = {
  title: 'Drivers',
};

export default async function DriversPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | undefined>>;
}) {
  const sp = searchParams ? await searchParams : {};

  const status = sp?.status || 'pending';
  const page = Number(sp.page ?? 1);
  const limit = Number(sp.limit ?? 10);

  const [user, drivers] = await Promise.all([
    currentUser(),
    getDrivers({ status, page, limit }),
  ]);

  const driverReturnTypesRes = await getDriverReturnTypes();
  const driverReturnTypes = driverReturnTypesRes.success
    ? driverReturnTypesRes.data
    : [];

  return (
    <DriversPageComponent
      user={user.user}
      driversData={drivers?.data ?? []}
      totalDrivers={drivers?.pagination?.total}
      initialStatus={status}
      driverReturnTypes={driverReturnTypes ?? []}
    />
  );
}
