import { Controller, useFormContext } from 'react-hook-form';
import Image from 'next/image';
import { useState } from 'react';

import { Description, Title } from '@radix-ui/react-dialog';
import { Church } from '@/types/church.type';

import Modal from './modal';
import Select from './select';
import Input from './input';
import ImageUploadInput from './forms/image-input';
import { Button } from './button';
import AddressSearchInput from './forms/address-input';

interface Branches {
  id: string;
  src: string;
  name: string;
}

const branches: Branches[] = [
  { id: '1', src: '/assets/default-church-logo.png', name: 'CCI Ikeja' },
  {
    id: '2',
    src: '/assets/default-church-logo.png',
    name: 'Harvesters Maryland',
  },
  { id: '3', src: '/assets/default-church-logo.png', name: 'CCI Yaba' },
];

interface EventFormProps {
  churches: Church[];
}

const EventForm = ({ churches }: EventFormProps) => {
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [visibleToOtherBranches, setVisibleToOtherBranches] =
    useState<boolean>(true);
  const [requiresRSVP, setRequiresRSVP] = useState<boolean>(true);
  const [branchSelection, setBranchSelection] = useState<'all' | 'select'>(
    'all'
  );

  const { register, control, setValue } = useFormContext();

  const churchOptions = churches.map((c) => ({
    value: c.churchId,
    label: c.name,
  }));

  const selectBranch = (id: string) => {
    setSelectedBranches((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  return (
    <>
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
            required: 'Please enter event name',
          })}
        />
      </div>

      <div className="flex-1 min-w-0 mt-6">
        <label className="block text-sm font-normal mb-2">Event host</label>
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

      <div className="flex items-center justify-between gap-6 flex-wrap mt-6">
        <div className="flex-1">
          <Input
            label="Event date"
            placeholder="Enter event date"
            type="date"
            {...register('eventDate', {
              required: 'Please enter event date',
            })}
          />
        </div>
        <div className="flex-1">
          <Input
            label="Event time"
            placeholder="Enter event time"
            type="time"
            {...register('eventTime', {
              required: 'Please enter event time',
            })}
          />
        </div>
      </div>

      <div className="mt-6">
        <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <AddressSearchInput
              name="address"
              label="Event Venue"
              noTopMargin
              defaultValue={field.value}
              validation={{ required: 'Enter event venue' }}
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
      </div>

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
          <p>What branches?</p>
          <div className="flex gap-3 items-center mt-3">
            <Button
              className="w-26 md:w-30"
              variant={branchSelection === 'all' ? 'default' : 'outline'}
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
                  className="w-26 md:w-30 flex items-center justify-center"
                  variant="outline"
                  type="button"
                  onClick={() => setBranchSelection('select')}
                >
                  <p>Select</p>
                  {selectedBranches.length > 0 && (
                    <div className="bg-green-500 w-4 h-4 rounded-full text-white">
                      <p className="text-a-10">{selectedBranches.length}</p>
                    </div>
                  )}
                </Button>
              }
              disableOutsideClick
            >
              {(close) => (
                <>
                  <Title className="text-xl font-semibold mb-2 md:text-2xl capitalize text-left">
                    Select branch
                  </Title>

                  <Description className="text-sm text-gray-500 font-normal mb-3 text-left">
                    Event will be visible to all branches you select
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
                        type="button"
                        onClick={() => selectBranch(branch.id)}
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
                    <Button type="button" variant="outline" onClick={close}>
                      Close
                    </Button>
                    <Button type="button" variant="default" onClick={close}>
                      Confirm
                    </Button>
                  </div>
                </>
              )}
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventForm;
