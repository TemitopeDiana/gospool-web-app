import { getPassengers } from '@/actions/getPassengers';
import PassengerPageComponent from '@/components/passenger-page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Passengers',
};
const PassengersPage = async () => {
  const passengers = await getPassengers();

  console.log({ passengers });
  return (
    <div>
      <PassengerPageComponent passengers={passengers.data || []} />
    </div>
  );
};

export default PassengersPage;
