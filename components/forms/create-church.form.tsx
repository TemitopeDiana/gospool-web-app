'use client';

import Image from 'next/image';
import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';

import { Button } from '../button';
import Input from './Input-plain';

import {
  createChurchAction,
  InitialCreateChurchFormState,
} from '@/actions/createChurch';

const initialState: InitialCreateChurchFormState = {};

const CreateChurchForm = ({ close }: { close: () => void }) => {
  const [state, formAction, isPending] = useActionState(
    createChurchAction,
    initialState
  );

  useEffect(() => {
    if (state?.success) {
      if (state?.errors) {
        toast.error(state.error_message);
      } else {
        toast.success('Church created successfully');
        close();
      }
    }
  }, [state, close]);

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

        <form action={formAction} className="flex flex-col gap-5">
          <Input
            name="name"
            label="Church name"
            placeholder="Enter name"
            error={state.errors?.name?.[0] as string}
          />

          {/* <ImageUploadInput name='logo' label='Church Logo' error={state.errors?.name?.[0] as string}
               /> */}

          <Button
            variant="default"
            loading={isPending}
            className="place-self-end mt-10 py-[13.5px] px-10"
          >
            Continue
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateChurchForm;
