import phone from 'phone';
import { useState } from 'react';
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { toast } from 'sonner';

import { createChurchBranch } from '@/actions/createChurchBranch';
import { Button } from '../button';
import Input from '../input';
import AddressSearchInput from './address-input';

import isEmail from 'validator/lib/isEmail';

interface ChurchBranchFormInput {
  churchId: string;
  name: string;
  address: string;
  location: {
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  leaderName: string;
  leaderEmail: string;
  leaderPhoneNumber: string;
  branchIdentifier?: string;
}

const defaultValues: ChurchBranchFormInput = {
  churchId: '',
  name: '',
  address: '',
  location: {
    coordinates: {
      latitude: 0,
      longitude: 0,
    },
  },
  leaderName: '',
  leaderEmail: '',
  leaderPhoneNumber: '',
  branchIdentifier: '',
};

interface Props {
  churchId: string;
  close: () => void;
}

const CreateChurchBranch = ({ close, churchId }: Props) => {
  const [isPending, setIsPending] = useState(false);
  const form = useForm<ChurchBranchFormInput>({
    defaultValues,
  });

  const { handleSubmit, setValue, control, watch } = form;

  const onSubmit: SubmitHandler<ChurchBranchFormInput> = async (data) => {
    setIsPending(true);

    try {
      const payload: ChurchBranchFormInput = {
        ...data,
        churchId,
      };

      const res = await createChurchBranch(payload);

      if (res.success) {
        toast.success(res.message);
        close();
      } else toast.error(res.message);
    } finally {
      setIsPending(false);
    }
    console.log(data);
  };

  console.log('Places', watch('address'));
  console.log('Lat', watch('location.coordinates.latitude'));

  return (
    <FormProvider {...form}>
      <form
        className="mt-10 flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          label="Branch name"
          name="name"
          validation={{ required: 'Branch name is required' }}
        />

        <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <AddressSearchInput
              name="address"
              label="Branch address"
              defaultValue={field.value}
              validation={{
                required: 'Please enter your address',
              }}
              onPlaceSelected={(place) => {
                field.onChange(place.formatted_address);
                setValue('address', place.formatted_address);
                setValue(
                  'location.coordinates.latitude',
                  place.geometry?.location?.lat() ?? 0
                );
                setValue(
                  'location.coordinates.longitude',
                  place.geometry?.location?.lng() ?? 0
                );
              }}
            />
          )}
        />

        <Input
          label="Branch leader full name"
          name="leaderName"
          validation={{ required: 'Leader name is required' }}
        />

        <Input
          label="Branch leader email address"
          name="leaderEmail"
          validation={{
            required: 'Leader email is required',
            validate: {
              isValidEmail: (value) =>
                isEmail(value) || 'Please enter a valid email address',
            },
          }}
        />

        <Input
          label="Branch leader phone number"
          name="leaderPhoneNumber"
          validation={{
            required: 'Leader phone number is required',
            validate: {
              isValid: (val) =>
                phone(val).isValid || 'Invalid international phone format',
            },
          }}
        />

        <Input
          label="Branch identifier"
          name="branchIdentifier"
          description="A short code used to uniquely identify a church branch (e.g., HICC_ANTHONY)."
        />

        <Button
          type="submit"
          variant="default"
          className="place-self-end xsm:px-[39.5px] py-[13.5px]"
          loading={isPending}
        >
          Save Branch
        </Button>
      </form>
    </FormProvider>
  );
};

export default CreateChurchBranch;
