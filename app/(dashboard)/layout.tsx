import { redirect } from 'next/navigation';

import SidebarLayout from '@/components/sidebar-layout';

import { currentUser } from '@/actions/current-user';
import { routes } from '@/lib/routes';
import { IconName } from '@/types/icon.type';
import { checkSession } from '@/actions/checkSession';
import { permissions } from '@/lib/permission-rules';
import { RoleEnum } from '@/types/user.type';

const menu: {
  label: string;
  link: string;
  svg: IconName;
  minimumPermission: string;
}[] = [
  {
    label: 'Churches',
    link: routes.branches(),
    svg: 'church',
    minimumPermission: permissions.church_view,
  },
  {
    label: 'Branches',
    link: routes.branches(),
    svg: 'church',
    minimumPermission: permissions.branches_view,
  },
   {
    label: 'Teams',
    link: routes.teams(),
    svg: 'church',
    minimumPermission: permissions.teams_view,
  },
  {
    label: 'Drivers',
    link: routes.drivers(),
    svg: 'car',
    minimumPermission: permissions.driver_view,
  },
  {
    label: 'Passengers',
    link: routes.passengers(),
    svg: 'user-tick',
    minimumPermission: permissions.passenger_view,
  },
  {
    label: 'Rides',
    link: routes.rides(),
    svg: 'routing',
    minimumPermission: permissions.ride_view,
  },
  {
    label: 'Bus',
    link: routes.bus(),
    svg: 'bus',
    minimumPermission: permissions.bus_view,
  },
  {
    label: 'Events',
    link: '#',
    svg: 'calendar',
    minimumPermission: permissions.event_view,
  },
  {
    label: 'Adverts',
    link: '#',
    svg: 'speaker',
    minimumPermission: permissions.advert_view,
  },
];

const DashboardLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const user = await currentUser();

  if (user.authRequired) {
    redirect(routes.signIn());
  }

  await checkSession();

  return (
    <SidebarLayout
      menu={menu}
      name={`${user.user?.firstName} ${user.user?.lastName}`}
      role={user.user?.roles[0] ?? RoleEnum.GOSPOOL_ADMIN}
    >
      {children}
    </SidebarLayout>
  );
};

export default DashboardLayout;
