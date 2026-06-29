'use client';

import { useEffect } from 'react';
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
  roles?: string[];
  userChurchId?: string;
  userBranchId?: string;
}

export function BusForm({
  churches,
  branches,
  loadingBranches,
  selectedChurchId,
  roles = [],
  userChurchId,
  userBranchId,
}: BusFormProps) {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  useEffect(() => {
    if (roles.includes('branchLeader') || roles.includes('hod')) {
      if (userChurchId) setValue('churchId', userChurchId);
      if (userBranchId) setValue('branchId', userBranchId);
    } else if (roles.includes('churchAdmin')) {
      if (userChurchId) setValue('churchId', userChurchId);
    }
  }, [roles, userChurchId, userBranchId, setValue]);

  const churchOptions = churches.map((c) => ({
    value: c.churchId,
    label: c.name,
  }));

  const branchOptions = branches.map((b) => ({
    value: b.branchId,
    label: b.name,
  }));

  const isGospoolAdmin = roles.includes('gospoolAdmin') || roles.length === 0;
  const isBranchStaff = roles.includes('branchLeader') || roles.includes('hod');

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

      {!isBranchStaff && (
        <div className="flex flex-col md:flex-row flex-wrap gap-6 md:items-center mt-6">
          {isGospoolAdmin && (
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
          )}

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
                      : selectedChurchId || userChurchId
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
      )}
    </>
  );
}
