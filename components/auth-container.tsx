import Image from 'next/image';
import { ReactNode } from 'react';

interface Props {
  title: string;
  children: ReactNode;
}
const AuthContainer = ({ children, title }: Props) => {
  return (
    <div>
      <div className="h-screen bg-primary items-center justify-center flex px-5">
        <div className="bg-white py-6 md:py-10 md:px-8 px-3 rounded-20 max-w-110.5 w-full animate-fadeIn">
          <Image
            src="/assets/logo-green.png"
            alt="gospool-logo"
            width={145}
            height={24}
            className="mb-8"
            priority
          />

          <div className="mt-8 flex flex-col gap-4">
            <h1 className="text-2xl font-semibold">{title}</h1>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;
