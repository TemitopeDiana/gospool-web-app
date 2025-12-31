'use client';

import { useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '../button';
import ImageUploadInput from './image-input';
import { uploadChurchLogo } from '@/actions/upload-church-logo.action';

interface UploadLogoFormInput {
  logo: FileList | null;
}

interface Props {
  churchId: string;
  close: () => void;
}

const UploadChurchLogoForm = ({ close, churchId }: Props) => {
  const [isPending, setIsPending] = useState(false);

  const form = useForm<UploadLogoFormInput>({
    defaultValues: { logo: null },
  });

  const { handleSubmit } = form;

  const onSubmit: SubmitHandler<UploadLogoFormInput> = async (data) => {
    setIsPending(true);

    try {
      const file = data.logo?.[0] ?? null;

      const res = await uploadChurchLogo(churchId, {
        logo: file,
      });

      if (!res.success) {
        throw new Error(res.message);
      }

      toast.success(res.message);
      form.reset();
      close();
    } catch (err) {
      const e = err as { message: string };
      toast.error(e.message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <ImageUploadInput
            name="logo"
            label="Upload Church Logo"
            required
            requiredText="Please upload a logo"
          />

          <Button
            type="submit"
            variant="default"
            loading={isPending}
            className="place-self-end mt-10 py-[13.5px] px-10"
          >
            Upload Logo
          </Button>
        </form>
      </FormProvider>
    </div>
  );
};

export default UploadChurchLogoForm;
