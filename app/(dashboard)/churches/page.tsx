import { redirect } from 'next/navigation';

import { routes } from '@/lib/routes';

const page = () => {
  redirect(routes.home());
};

export default page;
