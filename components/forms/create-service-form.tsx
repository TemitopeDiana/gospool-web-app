import {
  Controller,
  FormProvider,
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import Select, { SelectOptionType } from '../select/select';
import Input from '../input';
import { Button } from '../button';
import { createBranchServices } from '@/actions/create-branch-services';
import { toast } from 'sonner';
import { useState } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);
const formatTimeToAmPm = (time24: string) => {
  return dayjs(time24, 'HH:mm').format('h:mma');
};

const daysOptions = [
  { value: 'sunday', label: 'Sunday' },
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
];

interface Props {
  close: () => void;
  branchId: string;
}

interface ServiceItem {
  name: string;
  day: SelectOptionType | null;
  time: string;
}

interface CreateServiceFormValues {
  services: ServiceItem[];
}

const CreateChurchServiceForm = ({ close, branchId }: Props) => {
  const [isCreatingService, setIsCreatingService] = useState(false);
  const form = useForm<CreateServiceFormValues>({
    defaultValues: {
      services: [{ name: '', day: null, time: '' }],
    },
  });

  const { control, handleSubmit } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'services',
  });

  const onSubmit: SubmitHandler<CreateServiceFormValues> = async (data) => {
    console.log(data);
    const payload = {
      services: data.services.map((service) => ({
        name: service.name,
        day: service.day?.value ?? '',
        time: formatTimeToAmPm(service.time),
      })),
    };

    try {
      setIsCreatingService(true);

      const result = await createBranchServices(branchId, payload);

      if (result.success) {
        close();
        toast.success(result.message);
      } else {
        console.error(result.message);
        toast.error(result.message);
      }
    } finally {
      setIsCreatingService(false);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {fields.map((field, index) => (
          <div key={field.id} className="rounded border p-4 space-y-4">
            <Input
              name={`services.${index}.name`}
              label="Service Name"
              validation={{
                required: 'Service name is required',
              }}
            />

            <Controller
              name={`services.${index}.day`}
              control={control}
              rules={{
                required: 'Service day is required',
              }}
              render={({ field, fieldState: { error } }) => (
                <Select
                  inputId={`day-${index}`}
                  placeholder="Select day"
                  options={daysOptions}
                  value={field.value}
                  onChange={field.onChange}
                  error={error}
                  label="Service Day"
                />
              )}
            />

            <Input
              name={`services.${index}.time`}
              label="Service Time"
              type="time"
              validation={{
                required: 'Service time is required',
              }}
            />

            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-sm text-red-600"
              >
                Remove service
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={() => append({ name: '', day: null, time: '' })}
          className="text-sm text-primary ml-auto block w-max"
        >
          + Add another service
        </button>

        <Button className="w-full" loading={isCreatingService}>
          Add Services
        </Button>
      </form>
    </FormProvider>
  );
};

export default CreateChurchServiceForm;
