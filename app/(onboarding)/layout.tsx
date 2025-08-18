import SvgIcon from '@/components/svg-icon';
import { routes } from '@/lib/routes';

import Image from 'next/image';
import Link from 'next/link';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="min-h-screen bg-gray-100 flex-1">
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

            <div className="flex gap-3 items-center max-lg:hidden">
              <div className="relative rounded-full w-9 aspect-square overflow-hidden">
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
                <p className="text-a-12 text-gray-500">Super Admin</p>
              </div>
            </div>
          </div>
        </nav>

        <main className="p-5 lmd:p-8 [&>*]:max-w-[1000px] [&>*]:mx-auto  ">
          {children}
        </main>
      </div>
    </>
  );
}
