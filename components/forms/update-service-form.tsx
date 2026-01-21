import { updateBranchServices } from '@/actions/update-branch-services.action.';
import { Day } from '@/types/services.type';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useState } from 'react';
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '../button';
import Input from '../input';
import Select from '../select/select';
import { daysOptions, ServiceItem } from './create-service-form';

dayjs.extend(customParseFormat);
const formatTimeToAmPm = (time24: string) => {
  return dayjs(time24, 'HH:mm').format('h:mma');
};

const formatTimeTo24Hr = (time: string) => {
  return dayjs(time, ['h:mma', 'hh:mma']).format('HH:mm');
};

interface Props {
  close: () => void;
  branchId: string;
  serviceId: string;
  values: { name: string; day: string; time: string };
}

const UpdateChurchServiceForm = ({
  close,
  branchId,
  serviceId,
  values,
}: Props) => {
  const [isCUpdaingService, setIsUpdatingService] = useState(false);
  const form = useForm<ServiceItem>({
    defaultValues: {
      name: values.name,
      day: { value: values.day, label: values.day },
      time: formatTimeTo24Hr(values.time),
    },
  });

  const { control, handleSubmit } = form;

  const onSubmit: SubmitHandler<ServiceItem> = async (data) => {
    console.log(data);
    const payload = {
      name: data.name,
      day: data.day?.value as Day,
      time: formatTimeToAmPm(data.time),
    };

    try {
      setIsUpdatingService(true);

      const result = await updateBranchServices(branchId, serviceId, payload);

      if (result.success) {
        close();
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } finally {
      setIsUpdatingService(false);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded border p-4 space-y-4">
          <Input
            name="name"
            label="Service Name"
            validation={{
              required: 'Service name is required',
            }}
          />

          <Controller
            name="day"
            control={control}
            rules={{
              required: 'Service day is required',
            }}
            render={({ field, fieldState: { error } }) => (
              <Select
                inputId="day"
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
            name="time"
            label="Service Time"
            type="time"
            validation={{
              required: 'Service time is required',
            }}
          />
        </div>

        <Button className="w-full" loading={isCUpdaingService}>
          Update Service
        </Button>
      </form>
    </FormProvider>
  );
};

export default UpdateChurchServiceForm;
