'use client';

import phone from 'phone';
import { useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import isEmail from 'validator/lib/isEmail';

import { Button } from '../button';
import Input from '../input';
import ImageUploadInput from './image-input';

import { createChurchWithUpload } from '@/actions/createChurchWithLogoUpload';

interface CreateChurchFormInput {
  name: string;
  churchLogo: FileList | null;
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  adminPhoneNumber: string;
}

const defaultValues: CreateChurchFormInput = {
  name: '',
  churchLogo: null,
  adminFirstName: '',
  adminLastName: '',
  adminEmail: '',
  adminPhoneNumber: '',
};

const CreateChurchForm = ({ close }: { close: () => void }) => {
  const [isPending, setIsPending] = useState(false);
  const form = useForm<CreateChurchFormInput>({ defaultValues });
  const { handleSubmit } = form;

  const onSubmit: SubmitHandler<CreateChurchFormInput> = async (data) => {
    setIsPending(true);

    const payload = {
      ...data,
      logo: data.churchLogo?.[0] || null,
    };

    try {
      const res = await createChurchWithUpload(payload);

      if (!res?.success)
        throw new Error(res?.message || 'Failed to create church');

      toast.success(res.message || 'Church created successfully');
      form.reset();
      close?.();
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : 'Unexpected error');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <ImageUploadInput
              name="churchLogo"
              label="Upload Church Logo"
              required
              requiredText="Please Upload a logo"
            />
          </div>

          <Input
            name="name"
            label="Church Name"
            placeholder="Enter name"
            validation={{ required: 'Please enter church name' }}
          />

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
              label="Last Name"
              placeholder="Samuel"
              validation={{
                required: 'Please enter church admin Last name',
              }}
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
                    phone(val).isValid || 'Invalid international phone format',
                },
              }}
            />
          </div>

          <Button
            variant="default"
            loading={isPending}
            className="place-self-end mt-10 py-[13.5px] px-10"
          >
            {isPending ? 'Processing...' : 'Create Church'}
          </Button>
        </form>
      </FormProvider>
    </div>
  );
};

export default CreateChurchForm;
