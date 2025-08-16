import PassengerPageComponent from '@/components/passenger-page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Passengers',
};
const PassengersPage = () => {
  return (
    <div>
      <PassengerPageComponent />
    </div>
  );
};

export default PassengersPage;
