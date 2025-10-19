import { Metadata } from 'next';

import ReviewDriverApplication from '@/components/review-driver-application';
import { getDriver } from '@/actions/getDriver';
import { Driver } from '@/types/driver.type';
import DriverProfile from '@/components/driver-profile';
import { getRideHistory } from '@/actions/getRideHistory';
import { getEmergencyContact } from '@/actions/getEmergencyContact';

export const metadata: Metadata = {
  title: 'Driver profile', //change
};

type Props = {
  params: Promise<{ driverId: string }>;
};

const DriverPage = async ({ params }: Props) => {
  const { driverId } = await params;
  const res = await getDriver(driverId);
  const driver = res.data as Driver;

  const rideHistory = await getRideHistory({ driverId: driver.userId });
  const emergencyContact = await getEmergencyContact(driver.userId);

  return driver.statusDisplay === 'pending' ? (
    <ReviewDriverApplication driver={driver} />
  ) : (
    <DriverProfile
      driver={driver}
      rideHistory={rideHistory}
      emergencyContact={emergencyContact.data ?? []}
    />
  );
};

export default DriverPage;
