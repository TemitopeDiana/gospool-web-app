'use client';

import Image from 'next/image';
import {
  Controller,
  FormProvider,
  useForm,
  useFieldArray,
  UseFormRegister,
  Control,
  FieldValues,
} from 'react-hook-form';
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
import { createBusProfile } from '@/actions/createBusProfile';
import { getChurchBranches } from '@/actions/getChurchBranches';
import { Bus, PickupStop } from '@/types/bus.type';
import { Branch, Church, Pagination } from '@/types/church.type';

import Select from './select';
import InputFooterText from './input-footer-text';
import { BusForm } from './bus-form';
import { updateBusDetails } from '@/actions/updateBusDetails';
import { toggleBusPresence } from '@/actions/toggleBusPresence';
import { deleteBus } from '@/actions/deleteBus';

dayjs.extend(customParseFormat);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

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
  isActive: boolean;
  churchId: string;
  branchId: string;
  pickupLocations: PickupStop[];
  destination: string;
  departureLocations: PickupStop[];
  pickupDate: string;
  busType: string;
  year: number;
  name: string;
};

type MakePublicFormValues = {
  driverPhoto?: string;
  driverName: string;
  pickupLocations: PickupStop[];
  destination: string;
  departureLocations: PickupStop[];
  pickupDate: string;
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

// ---------------------------------------------------------------------------
// StopListEditor — reusable dynamic list for pickup / destination stops
// ---------------------------------------------------------------------------

interface StopListEditorProps {
  title: string;
  fieldName: string;
  withTime?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  control: Control<FieldValues>;
}

function StopListEditor({
  title,
  fieldName,
  withTime = false,
  register,
  control,
}: StopListEditorProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: fieldName,
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{title}</p>
        <button
          type="button"
          className="text-xs text-primary underline"
          onClick={() =>
            append(withTime ? { label: '', time: '' } : { label: '' })
          }
        >
          + Add stop
        </button>
      </div>

      {fields.length === 0 && (
        <p className="text-xs text-gray-400 italic">No stops added yet.</p>
      )}

      {fields.map((field, index) => (
        <div key={field.id} className="flex items-end gap-2">
          <div className="flex-1 min-w-0">
            <label className="text-sm block mb-2">Stop</label>
            <input
              placeholder="Stop label"
              className="w-full bg-gray-50 py-[13.5px] px-4 rounded-8 outline-none text-sm border-none placeholder:text-gray-300"
              {...register(`${fieldName}.${index}.label`, {
                required: 'Label is required',
              })}
            />
          </div>
          {withTime && (
            <div className="w-36 shrink-0">
              <label className="text-sm block mb-2">Time</label>
              <input
                type="time"
                className="w-full bg-gray-50 py-[13.5px] px-4 rounded-8 outline-none text-sm border-none"
                {...register(`${fieldName}.${index}.time`, {
                  required: 'Time is required',
                })}
              />
            </div>
          )}
          <button
            type="button"
            className="text-error-700 shrink-0 pb-[13.5px]"
            onClick={() => remove(index)}
            aria-label="Remove stop"
          >
            <SvgIcon name="trash" className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// BusPageComponent
// ---------------------------------------------------------------------------

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

  const editMethods = useForm<EditBusFormValues>({
    defaultValues: {
      pickupLocations: [],
      destination: '',
      departureLocations: [],
      pickupDate: '',
    },
  });

  const publicMethods = useForm<MakePublicFormValues>({
    defaultValues: {
      driverPhoto: '',
      driverName: '',
      pickupLocations: [],
      destination: '',
      departureLocations: [],
      pickupDate: '',
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
    control: publicControl,
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
      } catch {
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
      } catch {
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

  // -------------------------------------------------------------------------
  // Create bus
  // -------------------------------------------------------------------------

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

  // -------------------------------------------------------------------------
  // Edit bus
  // -------------------------------------------------------------------------

  const handleEditBus = (busId: string, closeDrawer: () => void) => {
    return handleEditSubmit(async (values) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { churchId, driverPhoto, destination, ...rest } = values;

        const payload = {
          ...rest,
          destinations: destination ? [{ label: destination }] : undefined,
          pickupDate: values.pickupDate
            ? new Date(values.pickupDate).toISOString()
            : undefined,
          ...(driverPhoto ? { driverPhoto } : {}),
        };

        const res = await updateBusDetails(busId, payload);
        if (res.success) {
          toast.success(res.message || 'Bus updated successfully');
          editReset();
          closeDrawer();
          router.refresh();
        } else {
          toast.error(res.message || 'Failed to update bus');
        }
      } catch (err) {
        console.error('Edit bus error:', err);
        toast.error('Something went wrong. Please try again.');
      }
    });
  };

  const openEditDrawer = (bus: Bus) => {
    const cleanStops = (stops: PickupStop[]) =>
      stops.map(({ label, time }) => ({ label, time }));

    editReset({
      driverName: bus.driverName || '',
      plateNumber: bus.plateNumber || '',
      color: bus.color || '',
      availableSeats: bus.availableSeats || 0,
      isPublic: bus.isPublic || false,
      isActive: bus.isActive || false,
      churchId: bus.churchId || '',
      branchId: bus.branchId || '',
      pickupLocations: cleanStops(bus.pickupLocations ?? []),
      destination: bus.destinations?.[0]?.label ?? '',
      departureLocations: cleanStops(bus.departureLocations ?? []),
      pickupDate: bus.pickupDate
        ? dayjs(bus.pickupDate).format('YYYY-MM-DD')
        : '',
      name: bus.name || '',
      busType: bus.busType || '',
      year: bus.year || undefined,
    });
  };

  // -------------------------------------------------------------------------
  // Make public
  // -------------------------------------------------------------------------

  const handleMakePublicSubmit = (busId: string, closeModal: () => void) => {
    return handlePublicSubmit(async (values) => {
      try {
        const payload = {
          driverName: values.driverName,
          pickupLocations: values.pickupLocations,
          destinations: values.destination
            ? [{ label: values.destination }]
            : [],
          departureLocations: values.departureLocations,
          pickupDate: values.pickupDate
            ? new Date(values.pickupDate).toISOString()
            : undefined,
          ...(values.driverPhoto ? { driverPhoto: values.driverPhoto } : {}),
        };

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
      } catch (err) {
        console.error('Make public error:', err);
        toast.error('Something went wrong. Please try again.');
      }
    });
  };

  const openPublicModal = (bus: Bus) => {
    const cleanStops = (stops: PickupStop[]) =>
      stops.map(({ label, time }) => ({ label, time }));

    publicMethods.reset({
      driverPhoto: '',
      driverName: bus.driverName || '',
      pickupLocations: cleanStops(bus.pickupLocations ?? []),
      destination: bus.destinations?.[0]?.label ?? '',
      departureLocations: cleanStops(bus.departureLocations ?? []),
      pickupDate: bus.pickupDate
        ? dayjs(bus.pickupDate).format('YYYY-MM-DD')
        : '',
    });
  };

  // -------------------------------------------------------------------------
  // Delete bus
  // -------------------------------------------------------------------------

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

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  const addBusForm = (
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

  return (
    <div className="w-full max-w-225 mx-auto">
      <div className="flex items-center justify-between mb-5 mt-3.5">
        <p className="text-xl xsm:text-3xl font-medium">Bus</p>
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
            return addBusForm;
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
                        <p>{el.driverName || '--'}</p>
                        <p className="text-gray-500 text-sm">
                          {el.pickupLocations?.[0]?.time
                            ? el.pickupLocations[0].time
                            : el.pickupDate
                              ? dayjs(el.pickupDate).format('D MMM')
                              : '--'}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">{el.availableSeats}</td>

                    {/* Make public toggle */}
                    <Modal
                      trigger={
                        <td
                          className="px-4 py-3"
                          onClick={() => openPublicModal(el)}
                        >
                          <button
                            className={`toggle-button ${el.isPublic ? 'bg-green-500 active' : 'bg-gray-100'}`}
                          />
                        </td>
                      }
                      title="Make Public"
                      contentCardClassName="text-left"
                    >
                      {(closeModal) => (
                        <FormProvider {...publicMethods}>
                          <div className="flex items-center gap-2 mt-5">
                            <Image
                              src="/assets/profile-pic.png"
                              alt="profile-pic"
                              width={48}
                              height={48}
                            />
                            <div className="text-left">
                              <p>Driver&apos;s photo</p>
                              <p className="mb-1 text-gray-500">
                                For easier recognition
                              </p>
                            </div>
                          </div>
                          <form
                            className="mt-4 flex flex-col gap-4"
                            onSubmit={(e) =>
                              handleMakePublicSubmit(el.busId, closeModal)(e)
                            }
                          >
                            <Input
                              type="text"
                              label="Driver name"
                              {...publicRegister('driverName', {
                                required: 'Driver name is required',
                              })}
                            />

                            <Input
                              type="date"
                              label="Pickup date"
                              {...publicRegister('pickupDate')}
                            />

                            <StopListEditor
                              title="Pickup stops"
                              fieldName="pickupLocations"
                              withTime
                              register={publicRegister}
                              control={
                                publicControl as unknown as Control<FieldValues>
                              }
                            />

                            <Input
                              type="text"
                              label="Destination"
                              placeholder="e.g. Church Auditorium, GRA"
                              {...publicRegister('destination')}
                            />

                            <StopListEditor
                              title="Drop offs (return trip)"
                              fieldName="departureLocations"
                              withTime
                              register={publicRegister}
                              control={
                                publicControl as unknown as Control<FieldValues>
                              }
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

                    {/* Actions popover */}
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
                                    className="h-4 w-4 text-gray-500"
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
                                      <p className="text-sm">
                                        Driver&apos;s photo
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        For easier recognition
                                      </p>
                                    </div>
                                  </div>

                                  <FormProvider {...editMethods}>
                                    <form
                                      className="flex flex-col gap-5 mt-5"
                                      onSubmit={(e) =>
                                        handleEditBus(el.busId, closeDrawer)(e)
                                      }
                                    >
                                      <Input
                                        type="text"
                                        label="Driver name"
                                        {...editRegister('driverName', {
                                          required: 'Driver name is required',
                                        })}
                                      />

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

                                      <div className="flex flex-wrap items-center gap-6">
                                        <div className="flex-1 min-w-0">
                                          <Input
                                            type="date"
                                            label="Pickup date"
                                            {...editRegister('pickupDate')}
                                          />
                                        </div>
                                      </div>

                                      <StopListEditor
                                        title="Pickup stops"
                                        fieldName="pickupLocations"
                                        withTime
                                        register={editRegister}
                                        control={
                                          editControl as unknown as Control<FieldValues>
                                        }
                                      />

                                      <Input
                                        type="text"
                                        label="Destination"
                                        placeholder="e.g. Church Auditorium, GRA"
                                        {...editRegister('destination')}
                                      />

                                      <StopListEditor
                                        title="Drop offs (return trip)"
                                        fieldName="departureLocations"
                                        withTime
                                        register={editRegister}
                                        control={
                                          editControl as unknown as Control<FieldValues>
                                        }
                                      />

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

                                      <div className="ml-auto flex flex-wrap items-center gap-5 max-w-fit mt-20">
                                        <Button
                                          variant="outline"
                                          className="xxs:py-[13.5px] xxs:px-15"
                                          onClick={closeDrawer}
                                        >
                                          Cancel
                                        </Button>
                                        <Button
                                          type="submit"
                                          variant="default"
                                          className="xxs:py-[13.5px] xxs:px-[34.5px]"
                                          disabled={isEditSubmitting}
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
              {addBusForm}
            </Modal>
          </div>
        </div>
      )}
    </div>
  );
}
