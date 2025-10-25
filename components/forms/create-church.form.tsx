'use client';

import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '../button';

import { createChurchAction } from '@/actions/createChurch';
import phone from 'phone';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import isEmail from 'validator/lib/isEmail';
import Input from '../input';

interface CreateChurchFirmInput {
  logo: string;
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  adminPhoneNumber: string;
}

const defaultValues: CreateChurchFirmInput = {
  logo: 'https://example.com/uploads/avatars/john_doe.jpg',
  adminFirstName: '',
  adminLastName: '',
  adminEmail: '',
  adminPhoneNumber: '',
};

const CreateChurchForm = ({ close }: { close: () => void }) => {
  const [isPending, setIsPending] = useState(false);

  const form = useForm<CreateChurchFirmInput>({ defaultValues });

  const { handleSubmit } = form;

  const onSubmit: SubmitHandler<CreateChurchFirmInput> = async (data) => {
    setIsPending(true);

    try {
      const res = await createChurchAction(data);

      if (res.success) {
        toast.success(res.message || 'Church created successfully');
        close();
      } else {
        toast.error(res.message);
      }
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div>
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

        <FormProvider {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <Input
              name="name"
              label="Church name"
              placeholder="Enter name"
              validation={{ required: 'Please enter church name' }}
            />
            {/* <ImageUploadInput name='logo' label='Church Logo' error={state.errors?.name?.[0] as string}
                 /> */}
            <p className="font-bold my-4">Church Admin Details</p>
            <div className="form-group">
              <Input
                name="adminFirstName"
                label="First Name"
                placeholder="Isaac"
                validation={{
                  required: 'Please enter church admin First name',
                }}
              />
              <Input
                name="adminLastName"
                label="Last name"
                placeholder="Samuel"
                validation={{ required: 'Please enter church admin Last name' }}
              />
              <Input
                name="adminEmail"
                type="email"
                label="Email"
                placeholder="something@example.com"
                validation={{
                  required: 'Please enter your email',
                  validate: {
                    isValidEmail: (value) =>
                      isEmail(value) || 'Please enter a valid email address',
                  },
                }}
              />
              <Input
                name="adminPhoneNumber"
                type="tel"
                label="Phone Number"
                placeholder="+234..."
                validation={{
                  required: 'Please enter admin phone number',
                  validate: {
                    isValid: (val) =>
                      phone(val).isValid ||
                      'Invalid international phone format',
                  },
                }}
              />
            </div>
            <Button
              variant="default"
              loading={isPending}
              className="place-self-end mt-10 py-[13.5px] px-10"
            >
              Create Church
            </Button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default CreateChurchForm;
