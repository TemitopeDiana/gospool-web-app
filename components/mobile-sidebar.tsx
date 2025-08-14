'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { routes } from '@/lib/routes';
import SvgIcon from './svg-icon';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { IconName } from '@/types/icon.type';
import { SidebarItems } from './sidebar-layout';

interface MobileSidebarProps {
  menu: SidebarItems[];
}

const MobileSideBar = ({ menu }: MobileSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const pathname = usePathname();

  const isActive = (route: string) => {
    return route === routes.home()
      ? pathname === route
      : pathname.startsWith(route);
  };

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div className="isolate z-90">
      <button
        className="rounded-full p-2 bg-gray-50 lg:hidden"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <SvgIcon name="menu" className="w-6 h-6 text-primary" />
      </button>

      <div
        className={cn(
          'blurred-bg fixed top-0 left-0 w-screen h-screen hidden -z-1 lg:hidden',
          isOpen && 'block'
        )}
        onClick={() => setIsOpen(false)}
      />

      <aside
        className={cn(
          'bg-primary text-white fixed top-0 right-0  max-w-a-500 transition-transform w-full h-lvh overflow-y-auto flex flex-col justify-between item-stretch lg:hidden pb-16 border-l',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col gap-5">
          <div className="flex justify-between bg-primary items-center p-5 sticky top-0  default-bg-color">
            <Link
              href={routes.home()}
              className="relative block w-32 h-6 lg:hidden"
            >
              <Image
                src="/assets/logo-white.png"
                alt="gospool logo"
                fill
                sizes="128px"
                className="object-contain"
              />
            </Link>

            <div className="flex gap-3 items-center">
              <button
                className="text-white h-max w-max rounded-[50%]"
                onClick={() => setIsOpen(false)}
                data-test="close-menu"
              >
                <SvgIcon name="close" className="w-8 h-8" />
              </button>
            </div>
          </div>

          <ul className="flex flex-col gap-3 border-y-2">
            {menu.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.link}
                  className={cn(
                    'flex gap-3 items-center justify-start w-full p-5',
                    isActive(item.link) && 'bg-white text-primary'
                  )}
                  data-test={item.label}
                >
                  <SvgIcon
                    name={item.svg as IconName}
                    className={`h-6 w-6 ${isActive(item.link) && 'text-primary'}`}
                  />
                  <p>{item.label}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-3 items-center mt-auto px-5 pt-5">
          <div className="relative rounded-full bg-white w-9 aspect-square overflow-hidden">
            <Image
              src="/assets/user-icon.png"
              alt="profile picture"
              fill
              sizes="100%"
              className="object-contain"
            />
          </div>

          <div>
            <p className="font-medium text-a-14">Paul Oluwatoni</p>
            <p className="text-a-12">Super Admin</p>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default MobileSideBar;
