import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import SidebarLayout from '@/components/sidebar-layout';

import { routes } from '@/lib/routes';
import { IconName } from '@/types/icon.type';
import { currentUser } from '@/actions/current-user';

const menu: {
  label: string;
  link: string;
  svg: IconName;
}[] = [
  {
    label: 'Churches',
    link: routes.home(),
    svg: 'church',
  },

  {
    label: 'Drivers',
    link: routes.drivers(),
    svg: 'car',
  },
  {
    label: 'Passengers',
    link: routes.passengers(),
    svg: 'user-tick',
  },
  {
    label: 'Rides',
    link: '#',
    svg: 'routing',
  },
  {
    label: 'Bus',
    link: '#',
    svg: 'bus',
  },
  {
    label: 'Events',
    link: '#',
    svg: 'calendar',
  },
  {
    label: 'Adverts',
    link: '#',
    svg: 'speaker',
  },
];

const DashboardLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const cookieStore = await cookies();
  const access_token = cookieStore.get('access_token')?.value;

  if (!access_token) {
    redirect('sign-in');
  }

  const user = await currentUser();

  return (
    <SidebarLayout
      menu={menu}
      first_name={user.user?.firstName ?? ''}
      last_name={user.user?.lastName ?? ''}
      role={user.user?.roles[0] ?? 'driver'}
    >
      {children}
    </SidebarLayout>
  );
};

export default DashboardLayout;
