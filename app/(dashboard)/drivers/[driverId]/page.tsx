import { Metadata } from 'next';

import ReviewDriverApplication from '@/components/review-driver-application';
import { getDriver } from '@/actions/getDriver';
import { Driver } from '@/types/driver.type';
import DriverProfile from '@/components/driver-profile';
import { getRideHistory } from '@/actions/getRideHistory';
import { getEmergencyContact } from '@/actions/getEmergencyContact';
import { getDriverReturnTypes } from '@/actions/getDriverReturnTypes';

type Props = {
  params: Promise<{ driverId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { driverId } = await params;
  const user = await getDriver(driverId);

  const fullName = user.data?.firstName + ' ' + user.data?.lastName;

  return {
    title: user.data?.firstName ? `${fullName} Profile` : undefined,
  };
}

const DriverPage = async ({ params }: Props) => {
  const { driverId } = await params;
  const res = await getDriver(driverId);
  const driver = res.data as Driver;

  const rideHistory = await getRideHistory({ driverId: driver.userId });
  const emergencyContact = await getEmergencyContact(driver.userId);

  const driverReturnTypesRes = await getDriverReturnTypes();
  const driverReturnTypes = driverReturnTypesRes.success
    ? driverReturnTypesRes.data
    : [];

  return driver.statusDisplay === 'Pending' ? (
    <ReviewDriverApplication
      driver={driver}
      driverReturnTypes={driverReturnTypes ?? []}
    />
  ) : (
    <DriverProfile
      driver={driver}
      rideHistory={rideHistory}
      emergencyContact={emergencyContact.data ?? []}
    />
  );
};

export default DriverPage;
