'use client';

import { routes } from '@/lib/routes';

import SidebarLayout from '@/components/sidebar-layout';
import { IconName } from '@/types/icon.type';

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

const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <SidebarLayout menu={menu}>{children}</SidebarLayout>;
};

export default DashboardLayout;
