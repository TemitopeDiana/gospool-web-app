'use client';

import Image from 'next/image';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { Button } from '@/components/button';
import Input from '@/components/input';
import Modal from '@/components/modal';
import SvgIcon from '@/components/svg-icon';
import Popover from '@/components/popover';
import Drawer from '@/components/drawer';
import RemoveUserIcon from '@/public/assets/user-remove.png';

import { routes } from '@/lib/routes';
import {
  TIME_FORMAT_12HR,
  TIME_FORMAT_AM_PM,
  TIME_FORMAT_HM,
} from '@/lib/constants';
import { createBusProfile } from '@/actions/createBusProfile';
import { getChurchBranches } from '@/actions/getChurchBranches';
import { Bus } from '@/types/bus.type';
import { Branch, Church, Pagination } from '@/types/church.type';

import Select from './select';
import InputFooterText from './input-footer-text';
import { BusForm } from './bus-form';
import { updateBusDetails } from '@/actions/updateBusDetails';
import { toggleBusPresence } from '@/actions/toggleBusPresence';
import { deleteBus } from '@/actions/deleteBus';

dayjs.extend(customParseFormat);

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

type EditBusFormValues = {
  driverName: string;
  driverPhoto: string;
  plateNumber: string;
  color: string;
  availableSeats: number;
  isPublic: boolean;
  churchId: string;
  branchId: string;
  pickupLocation: string;
  departureTime: string;
  busType: string;
  year: number;
  name: string;
  isActive: boolean;
  destination: string;
};

type MakePublicFormValues = {
  driverPhoto?: string;
  driverName: string;
  pickupLocation: string;
  destination: string;
  departureTime: string;
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

  const editMethods = useForm<EditBusFormValues>();

  const publicMethods = useForm<MakePublicFormValues>({
    defaultValues: {
      driverPhoto: '',
      driverName: '',
      pickupLocation: '',
      destination: '',
      departureTime: '',
    },
  });

  const {
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isSubmitting },
  } = methods;

  const {
    handleSubmit: handleEditSubmit,
    control: editControl,
    watch: editWatch,
    setValue: editSetValue,
    reset: editReset,
    register: editRegister,
    formState: { isSubmitting: isEditSubmitting, errors: editErrors },
  } = editMethods;

  const {
    handleSubmit: handlePublicSubmit,
    register: publicRegister,
    reset: handlePublicReset,
    formState: { isSubmitting: handlePublicSubmitting },
  } = publicMethods;

  const selectedChurchId = watch('churchId');
  const selectedBranchId = watch('branchId');

  const editSelectedChurchId = editWatch('churchId');

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

  useEffect(() => {
    const fetchEditBranches = async () => {
      if (!editSelectedChurchId) {
        setBranches([]);
        editSetValue('branchId', '');
        return;
      }

      setLoadingBranches(true);
      try {
        const result = await getChurchBranches(editSelectedChurchId);
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

    fetchEditBranches();
  }, [editSelectedChurchId, editSetValue]);

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

  const handleEditBus = (busId: string, closeDrawer: () => void) => {
    return handleEditSubmit(async (values) => {
      const formattedTime = dayjs(values.departureTime, TIME_FORMAT_HM).format(
        TIME_FORMAT_12HR
      );

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { churchId, ...rest } = values;

      const payload = {
        ...rest,
        departureTime: formattedTime,
      };

      if (values.driverPhoto) {
        payload.driverPhoto = values.driverPhoto;
      }

      const res = await updateBusDetails(busId, payload);

      if (res.success) {
        toast.success(res.message || 'Bus updated successfully');
        editReset();
        closeDrawer();
        router.refresh();
      } else {
        toast.error(res.message || 'Failed to update bus');
      }
    });
  };

  const openEditDrawer = (bus: Bus) => {
    editReset({
      driverName: bus.driverName || '',
      plateNumber: bus.plateNumber || '',
      color: bus.color || '',
      availableSeats: bus.availableSeats || 0,
      isPublic: bus.isPublic || false,
      isActive: bus.isActive || false,
      churchId: bus.churchId || '',
      branchId: bus.branchId || '',
      pickupLocation: bus.pickupLocation || '',
      departureTime: bus.departureTime
        ? dayjs(bus.departureTime, TIME_FORMAT_12HR).format(TIME_FORMAT_HM)
        : '',
      name: bus.name || '',
      busType: bus.busType || '',
      year: bus.year || undefined,
    });
  };

  const handleMakePublicSubmit = (busId: string, closeModal: () => void) => {
    return handlePublicSubmit(async (values) => {
      const formattedTime = dayjs(values.departureTime, TIME_FORMAT_HM).format(
        TIME_FORMAT_12HR
      );

      const payload: MakePublicFormValues = {
        driverName: values.driverName,
        pickupLocation: values.pickupLocation,
        destination: values.destination,
        departureTime: formattedTime,
      };

      if (values.driverPhoto) {
        payload.driverPhoto = values.driverPhoto;
      }

      const res = await toggleBusPresence(busId, payload);

      if (res.success) {
        toast.success(res.message || 'Bus made public successfully');
        handlePublicReset();
        closeModal();
        reset();
        router.refresh();
      } else {
        toast.error(res.message || 'Failed to update bus');
      }
    });
  };

  const openPublicModal = (bus: Bus) => {
    publicMethods.reset({
      driverPhoto: '',
      driverName: bus.driverName || '',
      pickupLocation: bus.pickupLocation || '',
      destination: '',
      departureTime: bus.departureTime || '',
    });
  };

  const handleDeleteBus = async (busId: string, closeModal: () => void) => {
    const res = await deleteBus(busId);

    if (res.success) {
      toast.success(res.message);
      closeModal();
      router.refresh();
    } else {
      toast.error(res.message);
    }
  };

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
                            ? dayjs(el.departureTime, TIME_FORMAT_12HR).format(
                                TIME_FORMAT_AM_PM
                              )
                            : '--'}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">{el.availableSeats}</td>

                    <Modal
                      trigger={
                        <td
                          className="px-4 py-3"
                          onClick={() => openPublicModal(el)}
                        >
                          <button
                            className={`toggle-button ${el.isPublic ? 'bg-green-500 active' : 'bg-gray-100'}`}
                          ></button>
                        </td>
                      }
                      title="Make Public"
                      contentCardClassName="text-left"
                    >
                      {(closeModal) => (
                        <FormProvider {...publicMethods}>
                          <div className="flex items-center gap-2 mt-5">
                            <div>
                              <Image
                                src="/assets/profile-pic.png"
                                alt="profile-pic"
                                width={48}
                                height={48}
                              />
                            </div>
                            <div className="text-left">
                              <p>Driver's photo</p>
                              <p className="mb-1 text-gray-500">
                                For easier recognition
                              </p>
                            </div>
                          </div>
                          <form
                            className="mt-4 flex flex-col gap-4"
                            onSubmit={handleMakePublicSubmit(
                              el.busId,
                              closeModal
                            )}
                          >
                            <Input
                              type="text"
                              label="Driver name"
                              {...publicRegister('driverName', {
                                required: 'Driver name is required',
                              })}
                            />

                            <Input
                              type="text"
                              label="Pickup location"
                              {...publicRegister('pickupLocation', {
                                required: 'Pickup location is required',
                              })}
                            />

                            <Input
                              type="time"
                              label="Departure time"
                              {...publicRegister('departureTime', {
                                required: 'Departure time is required',
                              })}
                            />

                            <Input
                              type="text"
                              label="Destination"
                              {...publicRegister('destination', {
                                required: 'Destination is required',
                              })}
                            />

                            <div className="mt-6 flex items-center justify-between">
                              <Button
                                variant="outline"
                                className="xxs:py-[13px] xxs:px-10"
                                onClick={closeModal}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="default"
                                className="xxs:py-[13px] xxs:px-[34px]"
                                disabled={handlePublicSubmitting}
                              >
                                {handlePublicSubmitting
                                  ? 'Updating...'
                                  : 'Update'}
                              </Button>
                            </div>
                          </form>
                        </FormProvider>
                      )}
                    </Modal>
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
                                <button
                                  className="flex items-center gap-2"
                                  onClick={() => openEditDrawer(el)}
                                >
                                  <SvgIcon
                                    name="edit"
                                    className="h-4 w-4 text-gray-500 "
                                  />
                                  Edit
                                </button>
                              }
                              title="Edit bus details"
                              description=""
                            >
                              {(closeDrawer) => (
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

                                  <FormProvider {...editMethods}>
                                    <form
                                      className="flex flex-col gap-5 mt-5"
                                      onSubmit={handleEditBus(
                                        el.busId,
                                        closeDrawer
                                      )}
                                    >
                                      <div>
                                        <Input
                                          type="text"
                                          label="Driver name"
                                          {...editRegister('driverName', {
                                            required: 'Driver name is required',
                                          })}
                                        />
                                      </div>

                                      <div className="flex flex-wrap items-center gap-6">
                                        <div className="flex-1 min-w-0">
                                          <Input
                                            label="Bus name"
                                            {...editRegister('name', {
                                              required: 'Please enter bus name',
                                            })}
                                          />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <Input
                                            label="Bus type"
                                            {...editRegister('busType', {
                                              required:
                                                'Please enter the bus type',
                                            })}
                                          />
                                        </div>
                                      </div>

                                      <div className="flex flex-wrap items-center gap-6">
                                        <div className="flex-1">
                                          <Input
                                            type="text"
                                            label="Plate Number"
                                            {...editRegister('plateNumber', {
                                              required:
                                                'Plate number is required',
                                            })}
                                          />
                                        </div>
                                        <div className="flex-1">
                                          <Input
                                            type="text"
                                            label="Color"
                                            {...editRegister('color', {
                                              required: 'Color is required',
                                            })}
                                          />
                                        </div>
                                      </div>

                                      <div className="flex flex-wrap items-center gap-6">
                                        <div className="flex-1 min-w-0">
                                          <Input
                                            type="number"
                                            label="Available seats"
                                            {...editRegister('availableSeats', {
                                              required:
                                                'Available seats is required',
                                            })}
                                          />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <Input
                                            label="Year"
                                            type="number"
                                            {...editRegister('year', {
                                              required: 'Please enter bus year',
                                              valueAsNumber: true,
                                              min: {
                                                value: 1900,
                                                message: 'Enter a valid year',
                                              },
                                            })}
                                          />
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-3">
                                        <Controller
                                          name="isPublic"
                                          control={editControl}
                                          render={({ field }) => (
                                            <button
                                              className={`toggle-button ${field.value ? 'bg-green-500 active' : 'bg-gray-100'}`}
                                              type="button"
                                              onClick={() =>
                                                field.onChange(!field.value)
                                              }
                                            />
                                          )}
                                        />
                                        <div>
                                          <p>Make public?</p>
                                          <p>
                                            List this bus on gospool for members
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <Controller
                                          name="isActive"
                                          control={editControl}
                                          render={({ field }) => (
                                            <button
                                              className={`toggle-button ${field.value ? 'bg-green-500 active' : 'bg-gray-100'}`}
                                              type="button"
                                              onClick={() =>
                                                field.onChange(!field.value)
                                              }
                                            />
                                          )}
                                        />
                                        <div>
                                          <p>Active bus?</p>
                                          <p>
                                            Keep this bus in the church fleet
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex flex-col md:flex-row flex-wrap gap-6 md:items-center">
                                        <div className="flex-1 min-w-0">
                                          <label className="block text-sm font-normal mb-2">
                                            Church
                                          </label>
                                          <Controller
                                            name="churchId"
                                            control={editControl}
                                            rules={{
                                              required:
                                                'Please select a church',
                                            }}
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

                                          {typeof editErrors.churchId
                                            ?.message === 'string' && (
                                            <InputFooterText
                                              text={editErrors.churchId.message}
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
                                            control={editControl}
                                            rules={{
                                              required:
                                                'Please select a branch',
                                            }}
                                            render={({ field }) => (
                                              <Select
                                                options={branchOptions}
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder={
                                                  loadingBranches
                                                    ? 'Loading branches...'
                                                    : editSelectedChurchId
                                                      ? 'Select a branch'
                                                      : 'Select church first'
                                                }
                                                className="bg-gray-50"
                                                noBorder
                                              />
                                            )}
                                          />
                                          {typeof editErrors.branchId
                                            ?.message === 'string' && (
                                            <InputFooterText
                                              text={editErrors.branchId.message}
                                              isError
                                            />
                                          )}
                                        </div>
                                      </div>
                                      <div className="flex flex-wrap items-center gap-6 ">
                                        <div className="flex-1">
                                          <Input
                                            type="text"
                                            label="Pickup location"
                                            {...editRegister('pickupLocation', {
                                              required:
                                                'Pickup location is required',
                                            })}
                                          />
                                        </div>

                                        <div className="flex-1">
                                          <Input
                                            type="time"
                                            label="Departure time"
                                            {...editRegister('departureTime', {
                                              required:
                                                'Departure time is required',
                                            })}
                                          />
                                        </div>
                                      </div>

                                      <div className="ml-auto flex flex-wrap items-center gap-5 max-w-fit mt-20">
                                        <Button
                                          variant="outline"
                                          className="xxs:py-[13.5px] xxs:px-15"
                                          onClick={closeDrawer}
                                        >
                                          Cancel
                                        </Button>
                                        <Button
                                          variant="default"
                                          className="xxs:py-[13.5px] xxs:px-[34.5px]"
                                        >
                                          {isEditSubmitting
                                            ? 'Saving...'
                                            : 'Save Changes'}
                                        </Button>
                                      </div>
                                    </form>
                                  </FormProvider>
                                </div>
                              )}
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
                              {(closeModal) => (
                                <div className="mx-auto flex flex-wrap items-center gap-5 mt-10 max-w-fit">
                                  <Button
                                    variant="outline"
                                    className="xxs:py-[13.5px] xxs:px-[34.5px]"
                                    onClick={closeModal}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    variant="danger"
                                    className="xxs:py-[13.5px] xxs:px-10"
                                    onClick={() =>
                                      handleDeleteBus(el.busId, closeModal)
                                    }
                                  >
                                    Remove
                                  </Button>
                                </div>
                              )}
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
