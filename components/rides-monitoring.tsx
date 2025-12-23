'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import dayjs from 'dayjs';
import { useTransition } from 'react';
import { toast } from 'sonner';

import { GoogleMapsEmbed } from '@next/third-parties/google';
import { Button } from '@/components/button';
import Drawer from '@/components/drawer';
import SvgIcon from '@/components/svg-icon';
import ToolTip from '@/components/tooltip';
import Popover from '@/components/popover';
import Trip from '@/types/trip.type';
import {
  DATE_FORMAT_MD,
  DAY_MONTH_FORMAT,
  TIME_FORMAT_AM_PM,
  TIME_FORMAT_HM,
} from '@/lib/constants';

import ShowView from './show-view';
import { cancelTrip } from '@/actions/cancelRide';

const statusButtons = [
  { value: 'in-progress', label: 'In progress' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'completed', label: 'History' },
];

interface IRides {
  rides: Trip[];
  initialStatus: string;
}

const MAX_TOOLTIP_CHARS = 40;

function RidesMonitoring({ rides, initialStatus }: IRides) {
  const [isCancellingTrip, startCancelTransition] = useTransition();

  const router = useRouter();
  const searchParams = useSearchParams();

  const currentStatus = searchParams.get('status') ?? initialStatus;

  const handleFilterChange = (status: string) => {
    const page = searchParams.get('page') ?? '1';
    const limit = searchParams.get('limit') ?? '10';

    router.push(`/rides?status=${status}&page=${page}&limit=${limit}`);
  };

  const handleCancelTrip = async (
    tripId: string,
    closePopover?: () => void
  ) => {
    startCancelTransition(async () => {
      try {
        const result = await cancelTrip({ tripId });

        if (result.success) {
          toast.success('Trip cancelled successfully');
          if (closePopover) closePopover();
          router.refresh();
        } else {
          toast.error('Failed to cancel trip');
        }
      } catch (err) {
        console.error('Cancel trip error:', err);
        toast.error('Unexpected error. Try again.');
      }
    });
  };

  return (
    <div>
      <h1 className="capitalize text-2xl md:text-3xl font-medium">
        Ride monitoring
      </h1>

      <div className="bg-background p-5 mt-5 rounded-12">
        <div className="flex items-center flex-wrap gap-2 mb-5">
          {statusButtons.map((el, index) => (
            <div key={index} className="w-max">
              <Button
                variant={currentStatus === el.value ? 'default' : 'outline'}
                className="capitalize px-3 py-[5.5px]"
                onClick={() => handleFilterChange(el.value)}
              >
                {el.label}
              </Button>
            </div>
          ))}
        </div>

        {rides.length > 0 ? (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <ShowView when={currentStatus === 'completed'}>
                    <th>date</th>
                  </ShowView>
                  <th>driver</th>
                  <th>destination</th>
                  <th>
                    {currentStatus === 'in-progress'
                      ? 'departure time'
                      : currentStatus === 'completed'
                        ? 'arrived by'
                        : 'scheduled for'}
                  </th>
                  <th>passengers</th>
                  <ShowView when={currentStatus !== 'completed'}>
                    <th>action</th>
                  </ShowView>
                </tr>
              </thead>

              <tbody>
                {rides.map((el, index) => (
                  <tr key={index}>
                    <ShowView when={currentStatus === 'completed'}>
                      <td className="px-4 py-3">
                        {dayjs(el.eventDate).format(DAY_MONTH_FORMAT)}
                      </td>
                    </ShowView>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          <div className="relative w-8 h-8 z-10">
                            <Image
                              src="/assets/profile-pic.png" //to be dynamic
                              alt="driver avatar"
                              fill
                              sizes="40px"
                            />
                          </div>

                          <div className="relative w-8 h-8 left-[-20%]">
                            <Image
                              src="/assets/default-church-logo.png" //to be dynamic
                              alt="church-logo"
                              fill
                              sizes="40px"
                            />
                          </div>
                        </div>
                        <div>
                          <p className="capitalize">{`${el.driver?.firstName || '---'} ${el.driver?.lastName || '--'} `}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        {el.destination.address.length > MAX_TOOLTIP_CHARS ? (
                          <ToolTip
                            content={el.destination.address}
                            trigger={
                              <p className="max-w-40 xsm:max-w-80 truncate">
                                {el.destination.address}
                              </p>
                            }
                          />
                        ) : (
                          <p className="max-w-40 xsm:max-w-80 truncate">
                            {el.destination.address}
                          </p>
                        )}

                        <p className="text-gray-500 capitalize">
                          {el.branch?.name}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 lowercase">
                      {currentStatus === 'in-progress'
                        ? dayjs(el.departureTime).format(TIME_FORMAT_AM_PM)
                        : currentStatus === 'completed'
                          ? dayjs(el.routeInfo?.arrivalTime).format(
                              TIME_FORMAT_AM_PM
                            )
                          : dayjs(el.eventDate).format(TIME_FORMAT_AM_PM)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center -space-x-1">
                        {el.passengers &&
                          el.passengers.map((el, index) => (
                            <div key={index} className="relative w-5 h-5">
                              <Image
                                src="/assets/profile-pic.png" //to be dynamic
                                alt="passenger-pic"
                                fill
                                sizes="100%"
                              />
                            </div>
                          ))}
                      </div>
                    </td>
                    <ShowView when={currentStatus !== 'completed'}>
                      <td>
                        <Popover
                          trigger={
                            <button className="block w-max">
                              <SvgIcon name="dotted-menu" className="w-7 h-5" />
                            </button>
                          }
                        >
                          <ul className="table-action-popover">
                            <li>
                              <Drawer
                                key={index}
                                trigger={
                                  <button className="flex items-center gap-2">
                                    <SvgIcon
                                      name="eye"
                                      className="h-4 w-4 text-gray-500"
                                    />
                                    View
                                  </button>
                                }
                                title="Ride details"
                                description=""
                              >
                                <div>
                                  <ShowView
                                    when={currentStatus === 'in-progress'}
                                  >
                                    <h1 className="font-semibold text-gray-900 text-2xl">
                                      Picking up next passenger
                                    </h1>
                                    <div className="mb-6 flex items-center gap-1 mt-1">
                                      <SvgIcon
                                        name="location"
                                        className="w-3 h-3"
                                      />
                                      <p className="text-gray-500 text-sm">
                                        {el.startLocation.address}
                                      </p>
                                    </div>
                                  </ShowView>

                                  <GoogleMapsEmbed
                                    apiKey={
                                      process.env
                                        .NEXT_PUBLIC_PLACES_API_KEY as string
                                    }
                                    mode="place"
                                    width="100%"
                                    height={200}
                                    zoom="15"
                                    q="Lagos"
                                    allowfullscreen
                                    style="h-full"
                                  />

                                  <div className="flex mt-8 items-center justify-between gap-1 sm:gap-3">
                                    <div className="flex items-start">
                                      <div className="relative w-12 h-12 mr-2 shrink-0">
                                        <Image
                                          src="/assets/profile-pic.png"
                                          alt="passenger-pic"
                                          fill
                                          sizes="100%"
                                        />
                                      </div>

                                      <div>
                                        <div>
                                          <p className="font-medium text-lg text-gray-800 mb-1">
                                            {el.driver?.firstName || '--'}
                                          </p>
                                          <div className="bg-gray-100 p-1 rounded-sm w-fit border border-b border-gray-300 border-4-4-dashed">
                                            <p className="text-gray-900 font-medium">
                                              {el.vehicle?.plateNumber || '--'}
                                            </p>
                                          </div>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">
                                          {el.vehicle?.carModel || '--'}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="relative w-24 xxs:w-30.25 h-18 shrink-0">
                                      <Image
                                        src="/assets/car.png"
                                        alt="car-image"
                                        fill
                                        sizes="100%"
                                      />
                                    </div>
                                  </div>

                                  <div className="flex mt-3 justify-between items-end">
                                    <div className="flex ">
                                      <SvgIcon
                                        name="ellipse"
                                        className="text-primary h-4 w-4 mr-3"
                                      />

                                      <div className="flex items-end justify-between">
                                        <div>
                                          <p className="text-gray-500">
                                            Leaving from
                                          </p>
                                          {el.startLocation.address.length >
                                          MAX_TOOLTIP_CHARS ? (
                                            <ToolTip
                                              content={el.startLocation.address}
                                              trigger={
                                                <p className="mt-2 max-w-40 xsm:max-w-80 truncate">
                                                  {el.startLocation.address}
                                                </p>
                                              }
                                            />
                                          ) : (
                                            <p className="mt-2 max-w-40 xsm:max-w-80 truncate">
                                              {el.startLocation.address}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    <div className="text-xs">
                                      {dayjs(el.departureTime).format(
                                        DATE_FORMAT_MD
                                      )}
                                      ,{' '}
                                      <span>
                                        {dayjs(el.departureTime).format(
                                          TIME_FORMAT_HM
                                        )}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="mt-6 font-medium">
                                    <p className="mb-5">Passengers</p>
                                    {el.passengers.map((passenger, index) => (
                                      <div
                                        key={index}
                                        className="flex items-center gap-2  mb-4"
                                      >
                                        <div className="relative w-12 h-12 shrink-0">
                                          <Image
                                            src="/assets/profile-pic.png"
                                            alt="passenger-pic"
                                            fill
                                            sizes="100%"
                                          />
                                        </div>
                                        <div>
                                          <p className="capitalize font-medium mb-2">
                                            {passenger.passenger.firstName}
                                          </p>
                                          <p className="text-gray-500">
                                            Pick up:{' '}
                                            <span className="text-gray-800">
                                              {passenger.pickupLocation.address}
                                            </span>
                                            <span className="ml-1">
                                              {dayjs(el.departureTime).format(
                                                TIME_FORMAT_HM
                                              )}
                                            </span>
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>

                                  <ShowView
                                    when={currentStatus === 'scheduled'}
                                  >
                                    <Button
                                      variant="danger"
                                      className="w-full flex justify-center text-background mt-a-60"
                                      onClick={() =>
                                        handleCancelTrip(el.tripId)
                                      }
                                      disabled={isCancellingTrip}
                                    >
                                      {isCancellingTrip
                                        ? 'Cancelling...'
                                        : 'Cancel ride'}
                                    </Button>
                                  </ShowView>
                                </div>
                              </Drawer>
                            </li>

                            <ShowView when={currentStatus === 'scheduled'}>
                              <li>
                                <button
                                  className="flex items-center gap-2 text-error-700"
                                  onClick={() => handleCancelTrip(el.tripId)}
                                  disabled={isCancellingTrip}
                                >
                                  <SvgIcon name="trash" className="h-4 w-4" />
                                  {isCancellingTrip
                                    ? 'Cancelling...'
                                    : 'Cancel'}
                                </button>
                              </li>
                            </ShowView>
                          </ul>
                        </Popover>
                      </td>
                    </ShowView>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="w-36.5 my-30 mx-auto text-center">
            <Image
              src="/assets/empty-inbox.png"
              alt="empty-inbox-image"
              width={64}
              height={64}
              className="mx-auto"
            />
            <p className="font-semibold mb-2">No rides yet</p>
            <p className="text-gray-500">There are no rides at this time</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RidesMonitoring;
