'use client';

import Image from 'next/image';
import dayjs from 'dayjs';

import { Button } from '@/components/button';
import SvgIcon from '@/components/svg-icon';
import ToolTip from '@/components/tooltip';
import GoogleMap from './google-map';
import Avatar from './avatar';
import ShowView from './show-view';

import Trip from '@/types/trip.type';
import { DATE_FORMAT_MD, TIME_FORMAT_HM } from '@/lib/constants';

interface IRideDetailsProps {
  ride: Trip;
  currentStatus: string;
  isCancellingTrip: boolean;
  onCancelTrip: () => void;
}

const MAX_TOOLTIP_CHARS = 40;

const RideMonitoringDetails = ({
  ride,
  currentStatus,
  isCancellingTrip,
  onCancelTrip,
}: IRideDetailsProps) => {
  const driverName = `${ride.driver.firstName} ${ride.driver.lastName}`;

  const passengerPickupStops = ride.passengers
    .map((passenger) => passenger.pickupLocation?.address)
    .filter(Boolean);

  const nextPassenger = ride.passengers.find(
    (passenger) => passenger.status !== 'picked-up'
  );

  const hasPassengersWaiting = Boolean(nextPassenger);

  const locationToDisplay = hasPassengersWaiting
    ? nextPassenger?.pickupLocation?.address
    : ride.destination?.address;

  return (
    <div>
      <ShowView when={currentStatus === 'in-progress'}>
        <h1 className="font-semibold text-gray-900 text-2xl">
          {hasPassengersWaiting
            ? 'Picking up next passenger'
            : 'Final destination'}
        </h1>

        <div className="mb-6 flex items-center gap-1 mt-1">
          <SvgIcon name="location" className="size-4 text-primary-500" />

          <p className="text-gray-500 text-sm">{locationToDisplay}</p>
        </div>
      </ShowView>

      <GoogleMap
        mode="directions"
        from={ride.startLocation?.address ?? ''}
        stops={passengerPickupStops}
        to={ride.destination?.address ?? ''}
        width="100%"
        height={300}
        allowFullScreen
        loading="lazy"
        title="Ride route"
      />

      <div className="flex mt-8 items-center justify-between gap-1 sm:gap-3">
        <div className="flex items-start gap-2">
          <Avatar src={ride.driver.avatar} className="size-12 shrink-0" />

          <div>
            <p className="font-medium text-lg text-gray-800 mb-1">
              {driverName}
            </p>

            <div className="bg-gray-100 p-1 rounded-sm w-fit border border-b border-gray-300 border-4-4-dashed">
              <p className="text-gray-900 font-medium">
                {ride.driver.carInfo?.plateNumber || '--'}
              </p>
            </div>

            <p className="text-sm text-gray-500 mt-1">
              {ride.driver.carInfo
                ? `${ride.driver.carInfo.color} ${ride.driver.carInfo.carModel} ${ride.driver.carInfo.year}`
                : '--'}
            </p>
          </div>
        </div>

        <div className="relative w-24 xxs:w-30.25 h-18 shrink-0">
          <Image
            src={ride.driver?.carInfo?.carImage || '/assets/car-icon.png'}
            alt="car-image"
            fill
            sizes="100%"
          />
        </div>
      </div>

      <div className="flex mt-3 justify-between items-end">
        <div className="flex">
          <SvgIcon name="ellipse" className="text-primary h-4 w-4 mr-3" />

          <div>
            <p className="text-gray-500">Leaving from</p>

            {ride?.startLocation?.address.length > MAX_TOOLTIP_CHARS ? (
              <ToolTip
                content={ride.startLocation.address}
                trigger={
                  <p className="mt-2 max-w-40 xsm:max-w-80 truncate">
                    {ride.startLocation.address}
                  </p>
                }
              />
            ) : (
              <p className="mt-2 max-w-40 xsm:max-w-80 truncate">
                {ride.startLocation.address}
              </p>
            )}
          </div>
        </div>

        <div className="text-xs">
          {dayjs(ride.departureTime).format(DATE_FORMAT_MD)}
          {', '}
          <span>{dayjs(ride.departureTime).format(TIME_FORMAT_HM)}</span>
        </div>
      </div>

      <div className="mt-6 font-medium">
        <p className="mb-5">Passengers</p>

        {ride.passengers.map((passenger, index) => (
          <div key={index} className="flex items-center gap-2 mb-4">
            <Avatar
              src={passenger.passenger.avatar}
              className="size-12 shrink-0"
            />

            <div className="w-full flex justify-between">
              <div>
                <p className="capitalize font-medium mb-2">
                  {`${passenger.passenger.firstName} ${passenger.passenger.lastName}`}
                </p>
                <p className="text-gray-500">
                  Pick up:{' '}
                  <span className="text-gray-800">
                    {passenger.pickupLocation?.address}
                  </span>
                  <span className="ml-1">
                    {dayjs(ride.departureTime).format(TIME_FORMAT_HM)}
                  </span>
                </p>
              </div>

              <ShowView when={passenger.status === 'picked-up'}>
                <div className="rounded-full">
                  <SvgIcon
                    name="check-circle"
                    className="size-4 text-primary"
                  />
                </div>
              </ShowView>
            </div>
          </div>
        ))}
      </div>

      <ShowView when={currentStatus === 'scheduled'}>
        <Button
          variant="danger"
          className="w-full flex justify-center text-background mt-a-60"
          onClick={onCancelTrip}
          disabled={isCancellingTrip}
        >
          {isCancellingTrip ? 'Cancelling...' : 'Cancel ride'}
        </Button>
      </ShowView>
    </div>
  );
};

export default RideMonitoringDetails;
