import { currentUser } from '@/actions/current-user';
import ClientHydrateUser from '@/components/client-hydrate-user';
import SvgIcon from '@/components/svg-icon';
import UserProfileButton from '@/components/user-profile-button';
import { routes } from '@/lib/routes';
import { RoleEnum } from '@/types/user.type';

import Image from 'next/image';
import Link from 'next/link';
import { use } from 'react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = use(currentUser());

  return (
    <div className="min-h-screen bg-gray-100 flex-1">
      <nav className="bg-white px-5 lmd:px-8 sticky shadow top-0 left-0 py-4 z-10 flex items-center">
        <Link
          href={routes.branches()}
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
            <UserProfileButton
              name={user?.user?.firstName || '--'}
              role={user?.user?.roles?.[0] || RoleEnum.CHURCH_ADMIN}
            />
          </div>

          {/* <MobileSideBar menu={menu} name={name} role={role} /> */}
        </div>
      </nav>

      {user?.user && <ClientHydrateUser user={user.user} />}

      <main className="p-5 lmd:p-8 [&>*]:max-w-[1000px] [&>*]:mx-auto  ">
        {children}
      </main>
    </div>
  );
}
