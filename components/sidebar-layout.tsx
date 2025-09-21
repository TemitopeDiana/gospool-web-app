'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

import MobileSideBar from './mobile-sidebar';
import SvgIcon from './svg-icon';
import UserProfileButton from './user-profile-button';

import { routes } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { type IconName } from '@/types/icon.type';
import { type Role } from '@/types/user.type';
import { useGetUser } from '@/hooks/useGetUser';

export interface SidebarItems {
  label: string;
  link: string;
  svg: IconName;
}

interface SidebarLayoutProps {
  menu: SidebarItems[];
  children: ReactNode;
  name: string;
  role: Role;
}

const SidebarLayout = ({ menu, children, name, role }: SidebarLayoutProps) => {
  useGetUser();
  const pathname = usePathname();

  const isActive = (route: string) => {
    if (route === routes.home()) {
      return (
        pathname === routes.home() || pathname.startsWith(routes.churches())
      );
    }

    return pathname.startsWith(route);
  };

  return (
    <div className="flex">
      <aside className="bg-primary text-white w-full sticky top-0 left-0 h-screen overflow-y-auto max-lg:hidden max-w-a-300 p-8 pt-0">
        <div className="p-8 pl-0 sticky top-0 bg-primary mb-4">
          <Link href={routes.home()} className="block relative  w-32 h-6">
            <Image
              src="/assets/logo-white.png"
              alt="gospool logo"
              fill
              sizes="128px"
              className="object-contain"
            />
          </Link>
        </div>

        <ul className="">
          {menu.map((item) => (
            <li key={item.label}>
              <Link
                href={item.link}
                className={cn(
                  'flex gap-2 items-center p-a-10 rounded mb-1',
                  isActive(item.link) && 'bg-white text-primary font-semibold'
                )}
              >
                <SvgIcon name={item.svg} className="w-5 h-5" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      <div className="min-h-screen w-full bg-gray-100 flex-1">
        <nav className="bg-white px-5 lmd:px-8 sticky shadow top-0 left-0 py-4 z-10 flex items-center">
          <Link
            href={routes.home()}
            className="relative block w-32 h-6 lg:hidden"
          >
            <Image
              src="/assets/logo-green.png"
              alt="gospool logo"
              fill
              sizes="128px"
              className="object-contain"
            />
          </Link>

          <div className="flex gap-6 ml-auto items-center w-max">
            <button
              aria-label="notification"
              className="p-3 rounded-full bg-gray-50"
            >
              <SvgIcon name="bell" className="w-6 h-6 text-primary" />
            </button>

            <div className="max-lg:hidden">
              <UserProfileButton name={name} role={role} />
            </div>

            <MobileSideBar menu={menu} name={name} role={role} />
          </div>
        </nav>

        <main className="p-5 lmd:p-8 [&>*]:max-w-[1000px] [&>*]:mx-auto  ">
          {children}
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;
