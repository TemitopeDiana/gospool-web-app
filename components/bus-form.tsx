'use client';

import { Controller, useFormContext } from 'react-hook-form';

import Select from './select';
import InputFooterText from './input-footer-text';

import Input from '@/components/input';
import { Branch, Church } from '@/types/church.type';

interface BusFormProps {
  churches: Church[];
  branches: Branch[];
  loadingBranches: boolean;
  selectedChurchId?: string;
}

export function BusForm({
  churches,
  branches,
  loadingBranches,
  selectedChurchId,
}: BusFormProps) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  const churchOptions = churches.map((c) => ({
    value: c.churchId,
    label: c.name,
  }));

  const branchOptions = branches.map((b) => ({
    value: b.branchId,
    label: b.name,
  }));

  return (
    <>
      <div className="flex flex-col md:flex-row flex-wrap md:items-center gap-6">
        <div className="flex-1 min-w-0">
          <Input
            label="Bus type"
            {...register('busType', {
              required: 'Please enter the bus type',
            })}
          />
        </div>
        <div className="flex-1 min-w-0">
          <Input
            label="Year"
            type="number"
            {...register('year', {
              required: 'Please enter bus year',
              valueAsNumber: true,
              min: {
                value: 1900,
                message: 'Enter a valid year',
              },
            })}
          />
        </div>
        <div className="flex-1 min-w-0">
          <Input
            label="Available seats"
            type="number"
            {...register('availableSeats', {
              required: 'Please enter available seats',
              valueAsNumber: true,
              min: {
                value: 1,
                message: 'Seats must be at least 1',
              },
            })}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-wrap gap-6 md:items-center mt-6 ">
        <div className="flex-1 min-w-0">
          <Input
            label="Bus name"
            {...register('name', {
              required: 'Please enter bus name',
            })}
          />
          {typeof errors.name?.message === 'string' && (
            <InputFooterText text={errors.name.message} isError />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <Input
            label="Plate number"
            {...register('plateNumber', {
              required: 'Please enter plate number',
            })}
          />
        </div>
        <div className="flex-1 min-w-0">
          <Input
            label="Color"
            {...register('color', {
              required: 'Please enter bus color',
            })}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-wrap gap-6 md:items-center mt-6">
        <div className="flex-1 min-w-0">
          <label className="block text-sm font-normal mb-2">Church</label>
          <Controller
            name="churchId"
            control={control}
            rules={{ required: 'Please select a church' }}
            render={({ field }) => (
              <Select
                options={churchOptions}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select a church"
                className="bg-gray-50"
              />
            )}
          />

          {typeof errors.churchId?.message === 'string' && (
            <InputFooterText text={errors.churchId.message} isError />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <label className="block text-sm font-normal mb-2">Branch</label>
          <Controller
            name="branchId"
            control={control}
            rules={{ required: 'Please select a branch' }}
            render={({ field }) => (
              <Select
                options={branchOptions}
                value={field.value}
                onChange={field.onChange}
                placeholder={
                  loadingBranches
                    ? 'Loading branches...'
                    : selectedChurchId
                      ? 'Select a branch'
                      : 'Select church first'
                }
                className="bg-gray-50"
              />
            )}
          />
          {typeof errors.branchId?.message === 'string' && (
            <InputFooterText text={errors.branchId.message} isError />
          )}
        </div>
      </div>
    </>
  );
}
