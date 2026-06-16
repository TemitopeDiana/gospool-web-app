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
            name="busType"
            validation={{
              required: 'Please enter the bus type',
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <Input
            label="Year"
            type="number"
            onKeyDown={(e) => {
              const allowed = [
                'Backspace',
                'Delete',
                'Tab',
                'ArrowLeft',
                'ArrowRight',
                'ArrowUp',
                'ArrowDown',
                'Home',
                'End',
              ];
              if (!allowed.includes(e.key) && !/^\d$/.test(e.key)) {
                e.preventDefault();
              }
            }}
            name="year"
            validation={{
              required: 'Please enter bus year',
              valueAsNumber: true,
              min: {
                value: 1990,
                message: 'Year must be 1990 or later',
              },
              max: {
                value: new Date().getFullYear(),
                message: `Year cannot be in the future`,
              },
              validate: (val) =>
                Number.isInteger(val) || 'Please enter a valid year',
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <Input
            label="Available seats"
            type="number"
            name="availableSeats"
            onKeyDown={(e) => {
              const allowed = [
                'Backspace',
                'Delete',
                'Tab',
                'ArrowLeft',
                'ArrowRight',
                'ArrowUp',
                'ArrowDown',
                'Home',
                'End',
              ];
              if (!allowed.includes(e.key) && !/^\d$/.test(e.key)) {
                e.preventDefault();
              }
            }}
            validation={{
              required: 'Please enter available seats',
              valueAsNumber: true,
              min: {
                value: 1,
                message: 'Seats must be at least 1',
              },
            }}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-wrap gap-6 md:items-center mt-6 ">
        <div className="flex-1 min-w-0">
          <Input
            label="Plate number"
            name="plateNumber"
            validation={{
              required: 'Please enter plate number',
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <Input
            label="Color"
            name="color"
            validation={{
              required: 'Please enter bus color',
            }}
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
                noBorder
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
                noBorder
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
