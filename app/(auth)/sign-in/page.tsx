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
        <div className="bg-white py-6 md:py-10 md:px-8 px-3 rounded-20 max-w-110.5 w-full animate-fadeIn">
          <Image
            src="/assets/logo-green.png"
            alt="gospool-logo"
            width={145}
            height={24}
            className="mb-8"
            priority
          />
          <SignInForm />

          <div className="mt-8 text-center text-sm text-gray-500">
            By logging in, you agree to our{' '}
            <a
              href="/privacy-policy"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
