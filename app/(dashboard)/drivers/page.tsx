import { Metadata } from 'next';

import DriversPageComponent from '@/components/drivers-page';

export const metadata: Metadata = {
  title: 'Drivers',
};
const DriversPage = () => {
  return <DriversPageComponent />;
};

export default DriversPage;
