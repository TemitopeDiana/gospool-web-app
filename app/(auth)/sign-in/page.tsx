'use client';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import Image from 'next/image';

import { Button } from '@/components/button';
import Input from '@/components/input';
import PasswordInput from '@/components/password-input';

// import { Metadata } from 'next';

// export const metadata: Metadata = {
//   title: 'Sign in',
// };

const SignInPage = () => {
  const router = useRouter();
  const methods = useForm();

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

          <FormProvider {...methods}>
            <form className="mt-8 flex flex-col gap-4">
              <h1 className="text-2xl font-semibold">Login</h1>
              <div className="flex flex-col gap-5">
                <Input
                  type="email"
                  name="email"
                  label="Email"
                  placeholder="dolapoEzegwu@gmail.com"
                />
                <PasswordInput
                  name="temporary-password"
                  label="Temporary Password"
                  placeholder="dolapoEzegwu@gmail.com"
                  isNewPassword
                />
              </div>
              <Button
                variant="default"
                className="place-self-end py-[13.5px] px-[39px]"
                onClick={() => router.push('/dashboard')}
              >
                Login
              </Button>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
