'use client';

import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Description, Title } from '@radix-ui/react-dialog';
import Image from 'next/image';
import { useState } from 'react';

import Input from './input';
import ImageUploadInput from './forms/image-input';
import { Button } from './button';
import Modal from './modal-component';
import AddressSearchInput from './forms/address-input';
import Select from './select';

import { Church } from '@/types/church.type';
import ShowView from './show-view';

interface CreateEventFormProps {
  churches: Church[];
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

const CreateEvent = ({ churches }: CreateEventFormProps) => {
  const methods = useForm();
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [visibleToOtherBranches, setVisibleToOtherBranches] =
    useState<boolean>(true);
  const [requiresRSVP, setRequiresRSVP] = useState<boolean>(true);
  const [branchSelection, setBranchSelection] = useState<'all' | 'select'>(
    'all'
  );

  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = methods;

  const selectBranch = (id: string) => {
    setSelectedBranches((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  const churchOptions = churches.map((c) => ({
    value: c.churchId,
    label: c.name,
  }));

  return (
    <div className="w-full max-w-169">
      <div className="dashboard-card">
        <h1 className="dashboard-heading-text">Create Event</h1>
        <p className="mt-2">Please go over driver’s application thoroughly</p>

        <div className="mt-8">
          <FormProvider {...methods}>
            <form action="" className="space-y-4">
              <ImageUploadInput
                label="Upload Event Logo"
                {...register('eventLogo', {
                  required: 'Please upload an event logo',
                })}
                className="hidden"
              />
              <Input
                label="Event name"
                placeholder="Enter event name"
                {...register('eventName', {
                  required: 'Please enter Enter event name number',
                })}
              />
              <Input
                label="Event host"
                placeholder="Enter event host"
                {...register('eventHost', {
                  required: 'Please enter Enter event host',
                })}
              />
              <div className="flex-1 min-w-0">
                <label className="block text-sm font-normal mb-2">
                  Event host
                </label>
                <Controller
                  name="churchId"
                  control={control}
                  rules={{ required: 'Please enter event host' }}
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
              </div>
              <div className="flex items-center justify-between gap-6 flex-wrap">
                <div className="flex-1">
                  <Input
                    label="Event date"
                    placeholder="Enter event name"
                    type="date"

                    {...register('eventDate', {
                      required: 'Please enter Enter event date',
                    })}
                  />
                </div>

                <div className="flex-1">
                  <Input
                    label="Event time"
                    placeholder="Enter event host"
                    type="time"

                    {...register('eventTime', {
                      required: 'Please enter Enter event time',
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
                      variant={!visibleToOtherBranches ? 'default' : 'outline'}
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
                      hideCloseButton
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

                            <Button variant="default">Confirm</Button>
                          </div>
                        </div>
                      )}
                    </Modal>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <Button variant="default" className="px-12">
                  Continue
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
