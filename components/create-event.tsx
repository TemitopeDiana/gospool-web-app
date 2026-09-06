'use client';

import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { Description, Title } from '@radix-ui/react-dialog';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import Input from './input';
import ImageUploadInput from './forms/image-input';
import { Button } from './button';
import AddressSearchInput from './forms/address-input';
import Select from './select';
import ShowView from './show-view';
import SvgIcon from './svg-icon';

import checkMark from '@/public/assets/check.png';
import { Bus } from '@/types/bus.type';
import { Church } from '@/types/church.type';
import Modal from '@/components/modal';

interface CreateEventFormProps {
  churches: Church[];
  buses: Bus[];
}

interface Branches {
  id: string;
  src: string;
  name: string;
}

const branches: Branches[] = [
  {
    id: '1',
    src: '/assets/default-church-logo.png',
    name: 'CCI Ikeja',
  },
  {
    id: '2',
    src: '/assets/default-church-logo.png',
    name: 'Harvesters Maryland',
  },
  {
    id: '3',
    src: '/assets/default-church-logo.png',
    name: 'CCI Yaba',
  },
];

const CreateEvent = ({ churches, buses }: CreateEventFormProps) => {
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [visibleToOtherBranches, setVisibleToOtherBranches] =
    useState<boolean>(true);
  const [requiresRSVP, setRequiresRSVP] = useState<boolean>(true);
  const [branchSelection, setBranchSelection] = useState<'all' | 'select'>(
    'all'
  );
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [isBusBooking, setIsBusBooking] = useState<boolean>(true);
  const [isRoundTrip, setIsRoundTrip] = useState<boolean>(true);

  const methods = useForm({
    defaultValues: {
      eventLogo: '',
      eventName: '',
      event: '',
      eventDate: '',
      eventTime: '',
      address: '',
      location: {
        coordinates: {
          latitude: 0,
          longitude: 0,
        },
      },
      bus: '',
      locations: [
        {
          pickupLocation: '',
          pickupTime: '',
          departureTime: '',
        },
      ],
    },
  });

  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    name: 'locations',
    control,
  });

  const selectBranch = (id: string) => {
    setSelectedBranches((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  const churchOptions = churches.map((c) => ({
    value: c.churchId,
    label: c.name,
  }));

  const busOptions = buses.map((bus) => ({
    value: bus.busId,
    label: bus.busType,
  }));

  useEffect(() => {
    if (fields.length === 0) {
      append({
        pickupLocation: '',
        pickupTime: '',
        departureTime: '',
      });
    }
  }, [fields.length, append]);

  return (
    <div className="w-full max-w-169">
      <div className="dashboard-card">
        <ShowView when={currentStep <= 2}>
          <h1 className="dashboard-heading-text">Create Event</h1>
          <p className="mt-2">Please go over driver’s application thoroughly</p>
        </ShowView>

        <ShowView when={currentStep == 3}>
          <h1 className="dashboard-heading-text">Review</h1>
          <p className="mt-2">Please crosscheck before you publish</p>
        </ShowView>

        <div className="mt-8">
          <FormProvider {...methods}>
            <form action="" className="space-y-4">
              <ShowView when={currentStep == 1}>
                <ImageUploadInput
                  label=""
                  {...register('eventLogo', {
                    required: 'Please upload an event logo',
                  })}
                  className="hidden"
                />
                <div className="mt-4">
                  <Input
                    label="Event name"
                    placeholder="Enter event name"
                    {...register('eventName', {
                      required: 'Please enter Enter event name number',
                    })}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <label className="block text-sm font-normal mb-2">
                    Event host
                  </label>
                  <Controller
                    name="event"
                    control={control}
                    rules={{ required: 'Please select event host' }}
                    render={({ field }) => (
                      <Select
                        options={churchOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select an event"
                        className="bg-gray-50"
                        noBorder
                      />
                    )}
                  />
                </div>

                <div className="flex items-center justify-between gap-6 flex-wrap">
                  <div className="flex-1">
                    <Input
                      label="Event date"
                      placeholder="Enter event name"
                      type="date"

                      {...register('eventDate', {
                        required: 'Please enter event date',
                      })}
                    />
                  </div>

                  <div className="flex-1">
                    <Input
                      label="Event time"
                      placeholder="Enter event host"
                      type="time"

                      {...register('eventTime', {
                        required: 'Please enter event time',
                      })}
                    />
                  </div>
                </div>

                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <AddressSearchInput
                      name="address"
                      label="Event Venue"
                      defaultValue={field.value}
                      validation={{
                        required: 'Enter event venue',
                      }}
                      onPlaceSelected={(place) => {
                        field.onChange(place.formatted_address ?? '');
                        setValue('address', place.formatted_address ?? '');
                        setValue(
                          'location.coordinates.latitude',
                          place.geometry?.location?.lat() ?? 0
                        );
                        setValue(
                          'location.coordinates.longitude',
                          place.geometry?.location?.lng() ?? 0
                        );
                      }}
                    />
                  )}
                />

                <div className="mb-3">
                  <p>Does event require registration or RSVP?</p>
                  <div className="flex gap-3 items-center mt-3">
                    <Button
                      className="px-10"
                      type="button"
                      variant={requiresRSVP ? 'default' : 'outline'}
                      onClick={() => setRequiresRSVP(true)}
                    >
                      Yes
                    </Button>
                    <Button
                      className="px-10"
                      type="button"
                      variant={!requiresRSVP ? 'default' : 'outline'}
                      onClick={() => setRequiresRSVP(false)}
                    >
                      No
                    </Button>
                  </div>
                </div>

                <div className="mb-3">
                  <div>
                    <p>Visible to other branches?</p>
                    <div className="flex gap-3 items-center mt-3">
                      <Button
                        className="px-10"
                        type="button"
                        variant={visibleToOtherBranches ? 'default' : 'outline'}
                        onClick={() => setVisibleToOtherBranches(true)}
                      >
                        Yes
                      </Button>
                      <Button
                        className="px-10"
                        type="button"
                        variant={
                          !visibleToOtherBranches ? 'default' : 'outline'
                        }
                        onClick={() => setVisibleToOtherBranches(false)}
                      >
                        No
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p>what branches?</p>
                    <div className="flex gap-3 items-center mt-3">
                      <Button
                        className="w-26 md:w-30"
                        variant="default"
                        type="button"
                        onClick={() => {
                          setBranchSelection('all');
                          setSelectedBranches([]);
                        }}
                      >
                        All
                      </Button>

                      <Modal
                        trigger={
                          <Button
                            className="w-26 md:w-30 flex items-center justify-between"
                            variant="outline"
                            type="button"
                            onClick={() => setBranchSelection('select')}
                          >
                            <p>Select</p>
                            <ShowView when={selectedBranches.length > 0}>
                              <div className="bg-green-500 w-4 h-4 rounded-full text-white">
                                <p className="text-a-10">
                                  {selectedBranches.length}
                                </p>
                              </div>
                            </ShowView>
                          </Button>
                        }
                        disableOutsideClick
                      >
                        {(close) => (
                          <div className="px-5 py-10 bg-white rounded-20 mx-auto shadow-lg focus:outline-none md:px-10 max-w-110.5">
                            <Title className="text-xl font-semibold mb-2 md:text-2xl capitalize">
                              Select branch
                            </Title>

                            <Description className="text-sm text-gray-500 font-normal mb-3">
                              Event will ve visible to all branches you select
                            </Description>

                            <div className="flex gap-3 items-center mt-8 flex-wrap">
                              {branches.map((branch) => (
                                <Button
                                  variant={
                                    selectedBranches.includes(branch.id)
                                      ? 'outline'
                                      : 'gray'
                                  }
                                  key={branch.id}
                                  className="px-2"
                                  onClick={() => {
                                    selectBranch(branch.id);
                                  }}
                                >
                                  <div className="relative w-6 h-6 rounded-full">
                                    <Image
                                      src={branch.src}
                                      alt={branch.name}
                                      className="w-6 h-6 rounded-full object-cover"
                                      sizes="24px"
                                      fill
                                    />
                                  </div>
                                  {branch.name}
                                </Button>
                              ))}
                            </div>

                            <div className="flex w-full justify-between mt-10 gap-5">
                              <Button variant="outline" onClick={close}>
                                Close
                              </Button>

                              <Button variant="default" onClick={close}>
                                Confirm
                              </Button>
                            </div>
                          </div>
                        )}
                      </Modal>
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <Button
                    variant="default"
                    className="px-12"
                    onClick={() => setCurrentStep(2)}
                    type="button"
                  >
                    Continue
                  </Button>
                </div>
              </ShowView>

              <ShowView when={currentStep == 2}>
                <div>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <p>Is bus booking available?</p>
                      <div className="flex gap-3 items-center mt-3">
                        <Button
                          className="px-10"
                          type="button"
                          variant={isBusBooking ? 'default' : 'outline'}
                          onClick={() => setIsBusBooking(true)}
                        >
                          Yes
                        </Button>
                        <Button
                          className="px-10"
                          type="button"
                          variant={!isBusBooking ? 'default' : 'outline'}
                          onClick={() => setIsBusBooking(false)}
                        >
                          No
                        </Button>
                      </div>
                    </div>

                    <div>
                      <p>Round trip Available? </p>
                      <div className="flex gap-3 items-center mt-3">
                        <Button
                          className="px-10"
                          type="button"
                          variant={isRoundTrip ? 'default' : 'outline'}
                          onClick={() => setIsRoundTrip(true)}
                        >
                          Yes
                        </Button>
                        <Button
                          className="px-10"
                          type="button"
                          variant={!isRoundTrip ? 'default' : 'outline'}
                          onClick={() => setIsRoundTrip(false)}
                        >
                          No
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    {fields.map((field, index) => (
                      <div key={field.id} className="mb-6">
                        {/* Pickup location */}
                        <Controller
                          name={`locations.${index}.pickupLocation`}
                          control={control}
                          render={({ field }) => (
                            <AddressSearchInput
                              name={`locations.${index}.pickupLocation`}
                              label="Pickup location"
                              defaultValue={field.value}
                              validation={{
                                required: 'Enter pickup location',
                              }}
                              onPlaceSelected={(place) => {
                                field.onChange(place.formatted_address ?? '');
                              }}
                            />
                          )}
                        />

                        {/* Arrival + Departure */}
                        <div className="flex items-center justify-between gap-6 flex-wrap mt-4">
                          <div className="flex-1">
                            <Input
                              label="Pickup time (Arrival)"
                              placeholder="Enter pickup time"
                              type="time"
                              {...register(`locations.${index}.pickupTime`, {
                                required: 'Please enter pickup time',
                              })}
                            />
                          </div>

                          <div className="flex-1">
                            <Input
                              label="Pickup time (Departure)"
                              placeholder="Enter pickup time"
                              type="time"
                              {...register(`locations.${index}.departureTime`, {
                                required: 'Please enter departure time',
                              })}
                            />
                          </div>
                        </div>

                        {/* Remove button */}
                        {fields.length > 1 && (
                          <div className="flex justify-end mt-3">
                            <button
                              type="button"
                              className="text-error-700 text-sm font-medium"
                              onClick={() => remove(index)}
                            >
                              <span className="mr-1">-</span>
                              Remove
                            </button>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Add more location */}
                    <button
                      type="button"
                      className="font-semibold text-a-16 text-primary"
                      onClick={() =>
                        append({
                          pickupLocation: '',
                          pickupTime: '',
                          departureTime: '',
                        })
                      }
                    >
                      <span className="mr-1">+</span>
                      More locations
                    </button>
                  </div>

                  <div className="flex-1 min-w-0 mt-4">
                    <label className="block text-sm font-normal mb-2">
                      Bus
                    </label>
                    <Controller
                      name="bus"
                      control={control}
                      rules={{ required: 'Please select a bus' }}
                      render={({ field }) => (
                        <Select
                          options={busOptions}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Select a bus"
                          className="bg-gray-50"
                          noBorder
                          renderOption={(option) => {
                            const bus = buses.find(
                              (bus) => bus.busId === option.value
                            );

                            if (!bus) return option.label;

                            return (
                              <div className="flex items-center gap-3">
                                <Image
                                  src="/assets/bus.png"
                                  alt=""
                                  width={54}
                                  height={54}
                                  className="object-contain"
                                />

                                <div>
                                  <p className="font-medium text-gray-800">
                                    {bus.availableSeats} seater
                                  </p>

                                  <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <div className="bg-gray-100 p-1 rounded-sm w-fit border border-b border-gray-300 border-4-4-dashed">
                                      <p className="text-gray-900 font-medium capitalize">
                                        {bus.plateNumber}
                                      </p>
                                    </div>
                                    <p>{bus.driverName} Gbenga</p>
                                  </div>
                                </div>
                              </div>
                            );
                          }}
                        />
                      )}
                    />
                  </div>

                  <div className="mt-8 flex justify-end">
                    <Button
                      variant="default"
                      className="px-12"
                      onClick={() => setCurrentStep(3)}
                      type="button"
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </ShowView>

              <ShowView when={currentStep == 3}>
                <div>
                  <div className="flex flex-wrap gap-5 items-center">
                    <div className="relative w-25 h-22 md:w-a-150 md:h-35 shrink-0">
                      <Image
                        src="/assets/event.png"
                        alt="event-logo"
                        className="w-25 h-22 md:w-a-150 md:h-35 rounded-12 object-cover"
                        sizes="100%"
                        fill
                      />
                    </div>

                    <div>
                      <h2>Holy Ghost Night</h2>

                      <div className="mt-4 flex gap-2 mb-1">
                        <SvgIcon name="location" className="size-5 shrink-0" />
                        <span>
                          Balmoral Convention Center, 30, Mobolojai Bank Anthony
                          Way, Maryland, Ikeja, Lagos
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <SvgIcon name="calendar" className="size-5 shrink-0" />
                        <div className="flex items-center flex-wrap gap-2">
                          12 June, 2025{' '}
                          <div className="w-0.5 h-0.5 rounded-full bg-gray-600"></div>{' '}
                          9:00 AM{' '}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <p className="text-lg font-medium text-gray-800">
                      Pickup locations
                    </p>

                    <div className="mt-4 flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-50 rounded-40 w-10 h-10 flex items-center justify-center">
                          <SvgIcon name="bus" className="size-5 shrink-0" />
                        </div>
                        <div>
                          <p>Charlie Boy</p>
                          <p>
                            Pickup: <span className="text-green-500">8:10</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="bg-gray-50 rounded-40 w-10 h-10 flex items-center justify-center">
                          <SvgIcon name="bus" className="size-5 shrink-0" />
                        </div>
                        <div>
                          <p>1234 Ahmadu Bello Way</p>
                          <p>
                            Pickup: <span className="text-green-500">8:30</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <Modal
                      trigger={
                        <Button variant="default" className="px-12">
                          Publish
                        </Button>
                      }
                      title="Event Listed"
                      description="Event is now live on members profile"
                      imageURL={checkMark}
                      imageClassName="w-20 h-[85px]"
                      maxWidthClassName="max-w-[442px]"
                    >
                      {(close) => (
                        <Button
                          onClick={close}
                          variant="default"
                          className="py-[13.5px] px-11.75 mt-10 mx-auto"
                        >
                          Okay
                        </Button>
                      )}
                    </Modal>
                  </div>
                </div>
              </ShowView>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
