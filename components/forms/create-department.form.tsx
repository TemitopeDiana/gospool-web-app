import { useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '../button';
import Input from '../input';
import Textarea from '../textarea';

import { createBranchDepartment } from '@/actions/create-branch-department';

import { updateBranchDepartment } from '@/actions/update-branch-department';

type Props = {
  close: () => void;
  branchId?: string;
  values?: DepartmentFormValues;
} & (
  | { edit?: true; departmentId: string; branchId?: never }
  | { edit?: false; departmentId?: never; branchId: string }
);

type DepartmentFormValues = {
  name: string;
  description?: string;
};

const CreateChurchDepartmentForm = ({
  close,
  branchId,
  edit,
  values,
  departmentId,
}: Props) => {
  const defaultValues: DepartmentFormValues = {
    name: values?.name ?? '',
    description: values?.description ?? '',
  };

  const [isCreatingDepartment, setIsCreatingDepartment] = useState(false);
  const form = useForm<DepartmentFormValues>({
    defaultValues,
  });

  const { handleSubmit } = form;

  const onSubmit: SubmitHandler<DepartmentFormValues> = async (data) => {
    const payload = {
      ...data,
    };

    try {
      setIsCreatingDepartment(true);

      const result = edit
        ? await updateBranchDepartment({ ...payload, departmentId })
        : await createBranchDepartment({
            ...payload,
            branchId: branchId ?? '',
          });

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
          {edit ? 'Update' : 'Add'} Department
        </Button>
      </form>
    </FormProvider>
  );
};

export default CreateChurchDepartmentForm;
