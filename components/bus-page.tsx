'use client';

import Image from 'next/image';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';

import { Button } from '@/components/button';
import Input from '@/components/input';
import Modal from '@/components/modal';
import SvgIcon from '@/components/svg-icon';
import Popover from '@/components/popover';
import Drawer from '@/components/drawer';
import RemoveUserIcon from '@/public/assets/user-remove.png';

import { routes } from '@/lib/routes';
import { createBusProfile } from '@/actions/createBusProfile';
import { Bus } from '@/types/bus.type';
import { Branch, Church, Pagination } from '@/types/church.type';
import Select from './select';
import InputFooterText from './input-footer-text';
import { getChurchBranches } from '@/actions/getChurchBranches';
import { BusForm } from './bus-form';
import { TIME_FORMAT_HM } from '@/lib/constants';

type CreateBusFormValues = {
  busType: string;
  year: number;
  availableSeats: number;
  plateNumber: string;
  color: string;
  name: string;
  churchId: string;
  branchId: string;
};

interface BusPageComponentProps {
  buses: Bus[];
  pagination?: Pagination;
  churches: Church[];
}

export interface Option {
  value: string;
  label: string;
}

export function BusPageComponent({ buses, churches }: BusPageComponentProps) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const modalCloseRef = useRef<(() => void) | null>(null);

  const router = useRouter();
  const methods = useForm<CreateBusFormValues>({
    defaultValues: {
      busType: '',
      year: undefined,
      availableSeats: undefined,
      plateNumber: '',
      color: '',
      name: '',
      churchId: '',
      branchId: '',
    },
  });

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { isSubmitting, errors },
  } = methods;

  const selectedChurchId = watch('churchId');
  const selectedBranchId = watch('branchId');

  useEffect(() => {
    const fetchBranches = async () => {
      if (!selectedChurchId) {
        setBranches([]);
        setValue('branchId', '');
        return;
      }

      setLoadingBranches(true);
      try {
        const result = await getChurchBranches(selectedChurchId);
        if (result.success) {
          setBranches(result.data || []);
        } else {
          toast.error('Failed to load branches');
          setBranches([]);
        }
      } catch (error) {
        console.error('Error fetching branches:', error);
        toast.error('Failed to load branches');
        setBranches([]);
      } finally {
        setLoadingBranches(false);
      }
    };

    fetchBranches();
  }, [selectedChurchId, setValue]);

  const churchOptions: Option[] = churches.map((church) => ({
    value: church.churchId,
    label: church.name,
  }));

  const branchOptions: Option[] = branches.map((branch) => ({
    value: branch.branchId,
    label: branch.name,
  }));

  const onSubmit = handleSubmit(async (values) => {
    const payload = {
      ...values,
      churchId: selectedChurchId,
      branchId: selectedBranchId,
    };

    const res = await createBusProfile(payload);

    if (res.success) {
      toast.success('Bus added successfully');
      reset();
      router.refresh();
      modalCloseRef.current?.();
    } else {
      toast.error('Failed to add bus');
    }
  });

  return (
    <div className="w-full max-w-225 mx-auto">
      <div className="flex items-center justify-between mb-5 mt-3.5">
        <p className="text-xl xsm:text-3xl font-medium ">Bus</p>
        <Modal
          trigger={
            <Button variant="default" className="md:px-10 md:py-[13.5px]">
              Add bus
            </Button>
          }
          title="Add bus profile"
          contentCardClassName="text-left"
          maxWidthClassName="w-[720px]"
        >
          {(close) => {
            modalCloseRef.current = close;
            return (
              <FormProvider {...methods}>
                <form className="mt-8" onSubmit={onSubmit}>
                  <BusForm
                    churches={churches}
                    branches={branches}
                    loadingBranches={loadingBranches}
                    selectedChurchId={selectedChurchId}
                  />

                  <Button
                    type="submit"
                    variant="default"
                    className="mt-8 px-13.75 py-[13.5px] ml-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Adding...' : 'Add bus'}
                  </Button>
                </form>
              </FormProvider>
            );
          }}
        </Modal>
      </div>

      {buses.length > 0 ? (
        <div className="bg-background rounded-12 p-5">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Buses</th>
                  <th>Departure</th>
                  <th>Available seats</th>
                  <th>Presence</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {buses.map((el, index) => (
                  <tr key={el.busId || index}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Image
                          src="/assets/bus.png"
                          alt="bus-img"
                          width={64}
                          height={64}
                        />
                        <div>
                          <p className="capitalize">{el.color}</p>
                          <div className="bg-gray-100 p-1 rounded-sm w-fit border border-b border-gray-300 border-4-4-dashed">
                            <p className="text-gray-900 font-medium capitalize">
                              {el.plateNumber}
                            </p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p>{el.driverName}</p>
                        <p>
                          {el?.departureTime
                            ? dayjs(el.departureTime).format(TIME_FORMAT_HM)
                            : '--'}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">{el.availableSeats}</td>

                    <td className="px-4 py-3">
                      <button className="bg-gray-100 toggle-button"></button>
                    </td>
                    <td className="px-4 py-3">
                      <Popover
                        trigger={
                          <button className="block w-max">
                            <SvgIcon name="dotted-menu" className="w-7 h-5" />
                          </button>
                        }
                      >
                        <ul className="table-action-popover">
                          <li>
                            <Link
                              href={`${routes.busProfile(el.busId)}`}
                              className="flex items-center gap-2"
                            >
                              <SvgIcon
                                name="eye"
                                className="h-4 w-4 text-gray-500"
                              />
                              View
                            </Link>
                          </li>
                          <li>
                            <Drawer
                              key={index}
                              trigger={
                                <button className="flex items-center gap-2">
                                  <SvgIcon
                                    name="edit"
                                    className="h-4 w-4 text-gray-500"
                                  />
                                  Edit
                                </button>
                              }
                              title="Edit bus details"
                              description=""
                            >
                              <div>
                                <div className="flex items-center gap-2">
                                  <Image
                                    src="/assets/profile-pic.png"
                                    alt="profile-pic"
                                    width={48}
                                    height={48}
                                  />
                                  <div>
                                    <p className="text-sm">Driver's photo</p>
                                    <p className="text-xs text-gray-500">
                                      For easier recognition
                                    </p>
                                  </div>
                                </div>

                                <FormProvider {...methods}>
                                  <form className="flex flex-col gap-5 mt-5">
                                    <Input
                                      type="text"
                                      name="driver-name"
                                      label="Driver name"
                                    />
                                    <div className="flex flex-wrap items-center gap-6">
                                      <div className="flex-1">
                                        <Input
                                          type="text"
                                          name="number-plate"
                                          label="Plate Number"
                                        />
                                      </div>
                                      <div className="flex-1">
                                        <Input
                                          type="text"
                                          name="color"
                                          label="Color"
                                        />
                                      </div>
                                    </div>
                                    <Input
                                      type="number"
                                      name="available-seats"
                                      label="Available seats"
                                    />
                                    <div className="flex items-center gap-3">
                                      <button
                                        className="toggle-button"
                                        type="button"
                                      ></button>
                                      <div>
                                        <p>Make public?</p>
                                        <p>
                                          List this bus on gospool for members
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-6 ">
                                      <div className="flex-1">
                                        <Input
                                          type="text"
                                          name="pickup-location"
                                          label="Pickup location"
                                        />
                                      </div>

                                      <div className="flex-1">
                                        <Input
                                          type="time"
                                          name="departure-time"
                                          label="Departure time"
                                        />
                                      </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row flex-wrap gap-6 md:items-center mt-6">
                                      <div className="flex-1 min-w-0">
                                        <label className="block text-sm font-normal mb-2">
                                          Church
                                        </label>
                                        <Controller
                                          name="churchId"
                                          control={control}
                                          rules={{
                                            required: 'Please select a church',
                                          }}
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

                                        {typeof errors.churchId?.message ===
                                          'string' && (
                                          <InputFooterText
                                            text={errors.churchId.message}
                                            isError
                                          />
                                        )}
                                      </div>

                                      <div className="flex-1 min-w-0">
                                        <label className="block text-sm font-normal mb-2">
                                          Branch
                                        </label>
                                        <Controller
                                          name="branchId"
                                          control={control}
                                          rules={{
                                            required: 'Please select a branch',
                                          }}
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
                                      </div>

                                      {typeof errors.branchId?.message ===
                                        'string' && (
                                        <InputFooterText
                                          text={errors.branchId.message}
                                          isError
                                        />
                                      )}
                                    </div>
                                  </form>
                                </FormProvider>
                              </div>
                            </Drawer>
                          </li>
                          <li className="text-error-700">
                            <Modal
                              trigger={
                                <button className="flex items-center gap-2">
                                  <SvgIcon name="trash" className="h-4 w-4" />
                                  Delete
                                </button>
                              }
                              title="Remove Bus"
                              description="The bus profile will no longer exist"
                              imageURL={RemoveUserIcon}
                              imageClassName="w-15 h-15"
                            >
                              <div className="mx-auto flex flex-wrap items-center gap-5 mt-10 max-w-fit">
                                <Button
                                  variant="outline"
                                  className="xxs:py-[13.5px] xxs:px-[34.5px]"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="danger"
                                  className="xxs:py-[13.5px] xxs:px-10"
                                >
                                  Remove
                                </Button>
                              </div>
                            </Modal>
                          </li>
                        </ul>
                      </Popover>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="relative bg-background text-center h-150 rounded-12">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Image
              src="/assets/empty-inbox.png"
              alt="empty-inbox-image"
              width={64}
              height={64}
              className="mx-auto"
            />
            <p className="font-semibold mt-2 mb-2 text-base xsm:text-xl">
              No Bus profile yet...
            </p>
            <p className="text-gray-500 text-sm">
              Add buses for church members to easily ride with
            </p>
            <Modal
              trigger={
                <Button variant="default" className="mx-auto mt-5 capitalize">
                  add bus
                </Button>
              }
              title="Add bus profile"
              contentCardClassName="text-left"
              maxWidthClassName="w-[720px]"
            >
              <FormProvider {...methods}>
                <form className="mt-8" onSubmit={onSubmit}>
                  <BusForm
                    churches={churches}
                    branches={branches}
                    loadingBranches={loadingBranches}
                    selectedChurchId={selectedChurchId}
                  />

                  <Button
                    type="submit"
                    variant="default"
                    className="mt-8 px-13.75 py-[13.5px] ml-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Adding...' : 'Add bus'}
                  </Button>
                </form>
              </FormProvider>
            </Modal>
          </div>
        </div>
      )}
    </div>
  );
}
