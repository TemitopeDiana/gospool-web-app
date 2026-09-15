'use client';

import Image from 'next/image';
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { useEffect } from 'react';

import SvgIcon from './svg-icon';
import { Button } from './button';
import Drawer from './drawer';
import EventForm from './event-form';

import Tabs from '@/components/tabs';
import { Church } from '@/types/church.type';
import { IconName } from '@/types/icon.type';
import { Bus } from '@/types/bus.type';
import AddressSearchInput from './forms/address-input';
import Input from './input';
import Select from './select';

interface EventProfileProps {
  churches: Church[];
  buses: Bus[];
}

interface AttendeesProps {
  name: string;
  src: string;
  date: string;
  busStop: string;
  branch: string;
  role: string;
  phone: string;
}

const attendees: AttendeesProps[] = [
  {
    name: 'favour umeh',
    src: '/assets/profile-pic.png',
    date: '12 June, 2025',
    busStop: 'charlie boy',
    branch: 'cci ikeja',
    role: 'passenger',
    phone: '0702531726',
  },
  {
    name: 'Benjamin njoku',
    src: '/assets/profile-pic.png',
    date: '13 July, 2025',
    busStop: 'charlie boy',
    branch: 'cci yaba',
    role: 'driver',
    phone: '0702531726',
  },
  {
    name: 'ifeoluwa oladapo',
    src: '/assets/profile-pic.png',
    date: '12 June, 2025',
    busStop: 'charlie boy',
    branch: 'cci ago',
    role: 'passenger',
    phone: '0702531726',
  },
];

const cards: {
  name: string;
  iconName: IconName;
  count: number;
}[] = [
  { name: 'All', iconName: 'document-text', count: 24 },
  {
    name: 'Passengers',
    iconName: 'profile',
    count: 22,
  },
  { name: 'Drivers', iconName: 'car', count: 2 },
];

const EventProfile = ({ churches, buses }: EventProfileProps) => {
  const editMethods = useForm({
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
        },
      ],
    },
  });

  const {
    register,
    control,
    formState: { errors },
  } = editMethods;

  const { fields, append, remove } = useFieldArray({
    name: 'locations',
    control,
  });

  const busOptions = buses.map((bus) => ({
    value: bus.busId,
    label: bus.busType,
  }));

  useEffect(() => {
    if (fields.length === 0) {
      append({
        pickupLocation: '',
        pickupTime: '',
      });
    }
  }, [fields.length, append]);

  return (
    <div className="w-full max-w-169 mx-auto">
      <div className="dashboard-card md:p-10">
        <h1 className="dashboard-heading-text">Event</h1>

        <Tabs
          tabsStyle="flex-wrap"
          tabs={[
            {
              label: 'Details ',
              content: (
                <>
                  <div className="flex flex-wrap gap-5 items-center mt-10">
                    <div className="relative w-25 h-22 md:w-a-150 md:h-35 shrink-0">
                      <Image
                        src="/assets/event.png"
                        alt="event-logo"
                        className="w-25 h-22 md:w-a-150 md:h-35 rounded-12 object-cover"
                        sizes="100%"
                        fill
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h2>Holy Ghost Night</h2>

                      <div className="flex items-center gap-1 mt-3">
                        <p>Host</p>
                        <div className="relative h-4 w-4">
                          <Image
                            src="/assets/default-church-logo.png"
                            alt="event-logo"
                            className="w-4 h-4 rounded-full object-cover"
                            sizes="100%"
                            fill
                          />
                        </div>
                        <p>CCI Ago</p>
                      </div>

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

                  <div className="mt-8 flex items-center justify-between">
                    <Button variant="outline" className="px-12">
                      Close
                    </Button>

                    <div className="flex justify-end">
                      <Drawer
                        disableEscapeDown
                        disableOutsideClick
                        title="Edit Event"
                        trigger={
                          <Button variant="default" className="px-12">
                            Edit
                          </Button>
                        }
                      >
                        {(close) => (
                          <FormProvider {...editMethods}>
                            <form onSubmit={editMethods.handleSubmit(() => {})}>
                              <Tabs
                                tabsStyle="flex-wrap"
                                tabs={[
                                  {
                                    label: 'General ',
                                    content: (
                                      <>
                                        <EventForm churches={churches} />
                                      </>
                                    ),
                                  },
                                  {
                                    label: 'Bus',
                                    content: (
                                      <>
                                        <div className="mt-6">
                                          {fields.map((field, index) => (
                                            <div
                                              key={field.id}
                                              className="mb-6"
                                            >
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
                                                      required:
                                                        'Enter pickup location',
                                                    }}
                                                    onPlaceSelected={(
                                                      place
                                                    ) => {
                                                      field.onChange(
                                                        place.formatted_address ??
                                                          ''
                                                      );
                                                    }}
                                                  />
                                                )}
                                              />

                                              <div className="flex-1 mt-4">
                                                <Input
                                                  label="Pickup time"
                                                  placeholder="Enter pickup time"
                                                  type="time"
                                                  {...register(
                                                    `locations.${index}.pickupTime`,
                                                    {
                                                      required:
                                                        'Please enter pickup time',
                                                    }
                                                  )}
                                                />
                                              </div>

                                              <div className="flex-1 min-w-0 mt-4">
                                                <label className="block text-sm font-normal mb-2">
                                                  Bus
                                                </label>
                                                <Controller
                                                  name="bus"
                                                  control={control}
                                                  rules={{
                                                    required:
                                                      'Please select a bus',
                                                  }}
                                                  render={({ field }) => (
                                                    <Select
                                                      options={busOptions}
                                                      value={field.value}
                                                      onChange={field.onChange}
                                                      placeholder="Select a bus"
                                                      className="bg-gray-50"
                                                      noBorder
                                                      renderOption={(
                                                        option
                                                      ) => {
                                                        const bus = buses.find(
                                                          (bus) =>
                                                            bus.busId ===
                                                            option.value
                                                        );

                                                        if (!bus)
                                                          return option.label;

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
                                                                {
                                                                  bus.availableSeats
                                                                }{' '}
                                                                seater
                                                              </p>

                                                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                                                <div className="bg-gray-100 p-1 rounded-sm w-fit border border-b border-gray-300 border-4-4-dashed">
                                                                  <p className="text-gray-900 font-medium capitalize">
                                                                    {
                                                                      bus.plateNumber
                                                                    }
                                                                  </p>
                                                                </div>
                                                                <p>
                                                                  {
                                                                    bus.driverName
                                                                  }{' '}
                                                                  Gbenga
                                                                </p>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        );
                                                      }}
                                                    />
                                                  )}
                                                />
                                              </div>

                                              {/* Remove button */}
                                              {fields.length > 1 && (
                                                <div className="flex justify-end mt-3">
                                                  <button
                                                    type="button"
                                                    className="text-error-700 text-sm font-medium"
                                                    onClick={() =>
                                                      remove(index)
                                                    }
                                                  >
                                                    <span className="mr-1">
                                                      -
                                                    </span>
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
                                              })
                                            }
                                          >
                                            <span className="mr-1">+</span>
                                            Add pickup
                                          </button>
                                        </div>
                                      </>
                                    ),
                                  },
                                ]}
                              />

                              <div className="mt-12 flex justify-end">
                                <Button
                                  variant="default"
                                  className="md:px-12 md:py-3.25"
                                  type="button"
                                >
                                  Save Changes
                                </Button>
                              </div>
                            </form>
                          </FormProvider>
                        )}
                      </Drawer>
                    </div>
                  </div>
                </>
              ),
            },
            {
              label: 'Attendees',
              content: (
                <>
                  <div className="mb-5">
                    <div className="max-w-screen mt-4 md:mt-8.75 pb-3 flex items-center overflow-x-auto gap-4 snap-x snap-mandatory">
                      {cards.map((card, idx) => (
                        <div
                          key={idx}
                          className="flex-1 h-19.75 rounded-xl snap-start bg-background px-3 border border-gray-50 flex items-center"
                        >
                          <div className="h-full flex items-center justify-center gap-2">
                            <div className="w-11.5 h-11.5 border border-gray-50 rounded-40 flex items-center justify-center">
                              <SvgIcon
                                name={card.iconName}
                                className="w-5 h-5"
                              />
                            </div>
                            <div>
                              <p className="font-medium text-xl">
                                {card.count}
                              </p>
                              <p className="text-gray-500 text-sm mb-1 capitalize">
                                {card.name}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4">
                      {attendees.map((attendee, idx) => (
                        <div key={idx} className="flex  gap-3 mt-3">
                          <div className="relative w-8 h-8">
                            <Image
                              src={attendee.src}
                              alt={attendee.name}
                              className="w-8 h-8 rounded-full object-cover"
                              sizes="100%"
                              fill
                            />
                          </div>
                          <div>
                            <p className="capitalize text-sm">
                              {attendee.name}
                            </p>

                            <div className="text-xs text-gray-500 mb-1 capitalize flex items-center gap-1">
                              {attendee.date}
                              <div className="w-0.5 h-0.5 rounded-full bg-gray-600"></div>
                              {attendee.busStop}
                            </div>

                            <div className="text-xs text-gray-500 mb-1 capitalize flex items-center gap-1">
                              {attendee.role}
                              <div className="w-0.5 h-0.5 rounded-full bg-gray-600"></div>
                              {attendee.branch}
                              <div className="w-0.5 h-0.5 rounded-full bg-gray-600"></div>
                              {attendee.phone}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ),
            },
          ]}
        ></Tabs>
      </div>
    </div>
  );
};

export default EventProfile;
