'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import dayjs from 'dayjs';
import { useTransition } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/button';
import Drawer from '@/components/drawer';
import SvgIcon from '@/components/svg-icon';
import ToolTip from '@/components/tooltip';
import Popover from '@/components/popover';
import Trip from '@/types/trip.type';
import { DAY_MONTH_FORMAT, TIME_FORMAT_AM_PM } from '@/lib/constants';

import ShowView from './show-view';
import { cancelTrip } from '@/actions/cancelRide';
import Avatar from './avatar';
import RideMonitoringDetails from './ride-monitoring-details';

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

  console.log({ rides });

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
                {rides.map((el, index) => {
                  const driverName = `${el.driver.firstName} ${el.driver.lastName}`;
                  const driverAvatar = el.driver.avatar;

                  return (
                    <tr key={index}>
                      <ShowView when={currentStatus === 'completed'}>
                        <td className="px-4 py-3">
                          {dayjs(el.eventDate).format(DAY_MONTH_FORMAT)}
                        </td>
                      </ShowView>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex isolate">
                            <Avatar src={driverAvatar} alt="driver avatar" />
                            <Avatar
                              src={el.church.logo}
                              alt="church logo"
                              className=""
                            />
                          </div>
                          <div>
                            <p className="capitalize">{driverName}</p>
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
                              <Avatar
                                key={el.passenger.firstName + index}
                                src={el.passenger.avatar}
                                alt={el.passenger.firstName}
                                className="size-6"
                              />
                            ))}
                        </div>
                      </td>
                      <ShowView when={currentStatus !== 'completed'}>
                        <td>
                          <Popover
                            trigger={
                              <button className="block w-max">
                                <SvgIcon
                                  name="dotted-menu"
                                  className="w-7 h-5"
                                />
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
                                  disableEscapeDown
                                  disableOutsideClick
                                >
                                  <RideMonitoringDetails
                                    ride={el}
                                    currentStatus={currentStatus}
                                    isCancellingTrip={isCancellingTrip}
                                    onCancelTrip={() =>
                                      handleCancelTrip(el.tripId)
                                    }
                                  />
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
                  );
                })}
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
