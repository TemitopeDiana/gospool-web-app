import SidebarLayout from '@/components/sidebar-layout';

import { currentUser } from '@/actions/current-user';
import { routes } from '@/lib/routes';
import { IconName } from '@/types/icon.type';
import { checkSession } from '@/actions/checkSession';

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
    link: routes.rides(),
    svg: 'routing',
  },
  {
    label: 'Bus',
    link: routes.bus(),
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
  const user = await currentUser();

  await checkSession();

  return (
    <SidebarLayout
      menu={menu}
      name={`${user.user?.firstName} ${user.user?.lastName}`}
      role={user.user?.roles[0] ?? 'gospoolAdmin'}
    >
      {children}
    </SidebarLayout>
  );
};

export default DashboardLayout;
