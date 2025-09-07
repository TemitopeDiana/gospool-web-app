'use client';
import { FormProvider, useForm } from 'react-hook-form';
import Image from 'next/image';
import { Dispatch, SetStateAction } from 'react';

import { Button } from '@/components/button';
import PasswordInput from '@/components/password-input';

interface IUpdatePasswordProps {
  setLogin: Dispatch<SetStateAction<boolean>>;
}

const UpdatePassword = ({ setLogin }: IUpdatePasswordProps) => {
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
                Welcome back, Temitope
              </h1>
              <div className="flex flex-col gap-5">
                <PasswordInput
                  name="new-password"
                  label="New Password"
                  placeholder="dolapoEzegwu@gmail.com"
                  isNewPassword
                />
                <PasswordInput
                  name="confirm-new-password"
                  label="Retype Password"
                  placeholder="dolapoEzegwu@gmail.com"
                  isNewPassword
                />
              </div>
              <Button
                type="button"
                variant="default"
                className="place-self-end py-[13.5px] px-[39px]"
                onClick={() => setLogin(true)}
              >
                Save new password
              </Button>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;
