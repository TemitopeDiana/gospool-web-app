import { useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '../button';
import Input from '../input';
import Textarea from '../textarea';

import { createBranchDepartment } from '@/actions/create-branch-department';

interface Props {
  close: () => void;
  branchId: string;
}

interface DepartmentFormValues {
  name: string;
  description?: string;
}

const defaultValues: DepartmentFormValues = {
  name: '',
  description: '',
};

const CreateChurchDepartmentForm = ({ close, branchId }: Props) => {
  const [isCreatingDepartment, setIsCreatingDepartment] = useState(false);
  const form = useForm<DepartmentFormValues>({
    defaultValues,
  });

  const { handleSubmit } = form;

  const onSubmit: SubmitHandler<DepartmentFormValues> = async (data) => {
    const payload = {
      ...data,
      branchId,
    };

    try {
      setIsCreatingDepartment(true);

      const result = await createBranchDepartment(payload);

      if (result.success) {
        close();
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } finally {
      setIsCreatingDepartment(false);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          name="name"
          label="Department Name"
          validation={{
            required: 'Department name is required',
          }}
        />

        <Textarea name="description" label="Department Description" />

        <Button className="w-full" loading={isCreatingDepartment}>
          Add Department
        </Button>
      </form>
    </FormProvider>
  );
};

export default CreateChurchDepartmentForm;
