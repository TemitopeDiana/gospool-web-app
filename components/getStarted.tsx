'use client';
import { FormProvider, useForm } from 'react-hook-form';
import Image from 'next/image';
import { Dispatch, SetStateAction } from 'react';

import { Button } from '@/components/button';
import Input from '@/components/input';
import PasswordInput from '@/components/password-input';

interface IGetStartedProps {
  setUpdatePassword: Dispatch<SetStateAction<boolean>>;
}

const GetStarted = ({ setUpdatePassword }: IGetStartedProps) => {
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
              <h1 className="text-xl md:text-2xl font-semibold">
                Let's get you started
              </h1>
              <div className="flex flex-col gap-5">
                <Input
                  type="email"
                  name="email"
                  label="Email"
                  placeholder="dolapoEzegwu@gmail.com"
                />
                <Input type="phone" name="phone" label="Phone number" />
                <PasswordInput
                  name="password"
                  label="Password"
                  placeholder="dolapoEzegwu@gmail.com"
                  isNewPassword
                />
              </div>
              <Button
                variant="default"
                type="button"
                className="place-self-end py-[13.5px] px-[39px]"
                onClick={() => setUpdatePassword(true)}
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

export default GetStarted;
