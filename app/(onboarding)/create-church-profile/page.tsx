'use client';
import Image from 'next/image';
import Link from 'next/link';
import { FormProvider, useForm } from 'react-hook-form';

import Input from '@/components/input';
import { Button } from '@/components/button';
import { routes } from '@/lib/routes';

const CreateChurchProfile = () => {
  const methods = useForm();

  return (
    <div>
      <div className="bg-background py-6 md:py-10 md:px-8 px-3 rounded-[20px] w-full max-w-[676px] mx-auto mt-10">
        <div className="flex flex-col gap-10">
          <div className="">
            <h1 className="font-semibold text-xl mb-2 md:text-3xl">
              Create Church Profile
            </h1>
            <p className="text-gray-400">Enter details to begin</p>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <Image
                src="/assets/default-church-logo.png"
                alt="church logo"
                width={48}
                height={48}
                className=""
                priority
              />

              <div className="">
                <h1 className="text-sm font-medium">Upload Church Logo</h1>
                <p className="text-gray-400 text-xs">Only Clear PNG</p>
              </div>
            </div>

            <FormProvider {...methods}>
              <form className="flex flex-col gap-5">
                <Input
                  name="church-name"
                  label="Church name"
                  placeholder="Enter name"
                />
                <Input
                  name="church-abbreviation"
                  label="Church abbreviation"
                  placeholder="CCI"
                />
                <Input
                  name="total-branches"
                  label="Total branches"
                  placeholder="Enter number"
                />
              </form>
            </FormProvider>
          </div>

          <Link
            href={routes.createSuperAdminProfile()}
            className="place-self-end mt-10 "
          >
            <Button variant="default" className="py-[13.5px] px-10">
              Continue
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreateChurchProfile;
