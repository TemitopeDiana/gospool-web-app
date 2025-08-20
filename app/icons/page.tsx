import { Metadata } from 'next';

import IconsPage from '@/components/icon-page';
import { redirect } from 'next/navigation';
import { routes } from '@/lib/routes';

export const metadata: Metadata = {
  title: 'Icons',
};
const page = () => {
  if (process.env.NODE_ENV !== 'development') {
    redirect(routes.home());
  }

  return <IconsPage />;
};

export default page;
