'use client';

import Image from 'next/image';
import { FormProvider, useForm } from 'react-hook-form';

import SvgIcon from './svg-icon';
import { Button } from './button';
import Drawer from './drawer';
import EventForm from './event-form';

import Tabs from '@/components/tabs';
import { Church } from '@/types/church.type';

interface EventProfileProps {
  churches: Church[];
}

const EventProfile = ({ churches }: EventProfileProps) => {
  const editMethods = useForm();

  return (
    <div className="w-full max-w-169">
      <div className="dashboard-card">
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
                            <div>
                              <Tabs
                                tabsStyle="flex-wrap"
                                tabs={[
                                  {
                                    label: 'General ',
                                    content: (
                                      <>
                                        <EventForm churches={churches} />
                                        <div className="mt-12 flex justify-end">
                                          <Button
                                            variant="default"
                                            className="px-12 py-3.25"
                                            type="button"
                                          >
                                            Save Changes
                                          </Button>
                                        </div>
                                      </>
                                    ),
                                  },
                                  {
                                    label: 'Bus',
                                    content: <></>,
                                  },
                                ]}
                              />
                            </div>
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
              content: <></>,
            },
          ]}
        ></Tabs>
      </div>
    </div>
  );
};

export default EventProfile;
