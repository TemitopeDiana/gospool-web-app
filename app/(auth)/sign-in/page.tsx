import { Metadata } from 'next';
import Image from 'next/image';

import SignInForm from './form';

export const metadata: Metadata = {
  title: 'Sign in',
};

const SignInPage = () => {
  return (
    <div>
      <div className="h-screen bg-primary items-center justify-center flex px-5">
        <div className="bg-white py-6 md:py-10 md:px-8 px-3 rounded-[20px] max-w-[442px] w-full animate-fadeIn">
          <Image
            src="/assets/logo-green.png"
            alt="gospool-logo"
            width={145}
            height={24}
            className="mb-8"
            priority
          />

          <SignInForm />
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
