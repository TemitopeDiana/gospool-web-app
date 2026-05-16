'use client';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';

import Input from '@/components/input';
import { Button } from '@/components/button';
import { useStore } from '@/client--store';
import { useEffect, useState } from 'react';
import { onboardChurchWithUpload } from '@/actions/createChurchWithLogoUpload';
import { toast } from 'sonner';
import ImageUploadInput from '@/components/forms/image-input';
import { useRouter } from 'next/navigation';

interface ChurchFormInput {
  'church-name': string;
  'church-abbreviation': string;
  churchLogo: FileList | null;
}

const CreateChurchProfile = () => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const methods = useForm<ChurchFormInput>({
    defaultValues: {
      'church-name': '',
      'church-abbreviation': '',
    },
  });

  const user = useStore((state) => state.user);

  const { handleSubmit, reset } = methods;

  const onSubmit: SubmitHandler<ChurchFormInput> = async (data) => {
    setIsPending(true);

    try {
      const payload = {
        name: data['church-name'],
        uniqueIdentifier: data['church-abbreviation'],
        logo: data.churchLogo?.[0] || null,
        adminId: user?.id || '',
      };

      const res = await onboardChurchWithUpload(payload);

      if (res.success) {
        toast.success(res.message);
        router.push('/');
      } else toast.error(res.message);
    } finally {
      setIsPending(false);
    }
    console.log(data);
  };

  useEffect(() => {
    if (user?.church) {
      reset({
        'church-name': user.church.name,
        'church-abbreviation': user.church.uniqueIdentifier,
      });
    }
  }, [reset, user]);

  return (
    <div>
      <div className="bg-background py-6 md:py-10 md:px-8 px-3 rounded-[20px] w-full max-w-[676px] mx-auto mt-10">
        <div>
          <div className="flex flex-col gap-10">
            <div className="">
              <h1 className="font-semibold text-xl mb-2 md:text-3xl">
                Complete Church Profile
              </h1>
              <p className="text-gray-400">
                We’ve prefilled known details. Feel free to edit.
              </p>
            </div>

            <FormProvider {...methods}>
              <form
                className="flex flex-col gap-5"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="flex items-center gap-2">
                  <ImageUploadInput
                    name="churchLogo"
                    label="Upload Church Logo"
                    required
                    requiredText="Please Upload a logo"
                  />
                </div>

                <Input
                  name="church-name"
                  label="Church name"
                  placeholder="Enter name"
                  validation={{ required: 'Church name is required' }}
                />
                <Input
                  name="church-abbreviation"
                  label="Church abbreviation"
                  placeholder="Enter abbreviation"
                />

                <Button
                  type="submit"
                  variant="default"
                  className="place-self-end capitalize mt-10 py-[13.5px] px-10"
                  loading={isPending}
                >
                  Continue
                </Button>
                {/* <Modal
                  trigger={
                  }
                  title="Invites Sent"
                  description="They should get their onboarding details in their mail now"
                  imageURL={checkMark}
                  imageClassName="w-20 h-[85px]"
                  maxWidthClassName="max-w-[442px]"
                >
                  {(close) => (
                    <Button
                      onClick={close}
                      variant="default"
                      className="py-[13.5px] px-[47px] mt-10 mx-auto"
                    >
                      Okay
                    </Button>
                  )}
                </Modal> */}
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Page() {
  return <CreateChurchProfile />;
}
