'use client';

import Image from 'next/image';
import dayjs from 'dayjs';

import SvgIcon from '@/components/svg-icon';
import { Bus } from '@/types/bus.type';
import { DAY_MONTH_FORMAT, TIME_FORMAT_HM } from '@/lib/constants';

interface BusProfileProps {
  bus: Bus;
}

function BusProfile({ bus }: BusProfileProps) {
  return (
    <div className="flex flex-col sm:items-start sm:flex-row gap-6">
      {/* ── Left panel ─────────────────────────────────────────── */}
      <div className="bg-background flex flex-col gap-5 py-8 px-5 rounded-20 w-full sm:max-w-[326px]">
        {/* Driver photo + name */}
        <div>
          <div className="flex relative mb-3">
            <Image src="/assets/bus.png" alt="bus" width={121} height={68} />
            <div className="absolute left-[81px] bottom-5 w-12 h-12 flex items-center justify-center rounded-full bg-background">
              <Image
                src={bus.driverPhoto || '/assets/profile-pic.png'}
                alt="driver"
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
            </div>
          </div>
          <h1 className="font-medium text-xl md:text-3xl">
            {bus.driverName || '--'}
          </h1>
          <p className="text-gray-500 text-sm">{bus.name}</p>
        </div>

        {/* Status badges */}
        <div className="flex items-center gap-2">
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${
              bus.isPublic
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {bus.isPublic ? 'Public' : 'Private'}
          </span>
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${
              bus.isActive
                ? 'bg-blue-100 text-blue-700'
                : 'bg-red-100 text-red-500'
            }`}
          >
            {bus.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>

        {/* Seat stats */}
        <ul className="bg-gray-100 rounded-12 p-2 flex flex-col gap-2">
          <li className="rounded-12 bg-background text-primary flex items-center justify-between p-3">
            <div className="flex items-center gap-4">
              <SvgIcon name="calendar" className="w-4 h-4" />
              <p>Booked</p>
            </div>
            <p className="text-primary-500">{bus.bookedSeats || 0}</p>
          </li>
          <li className="rounded-12 bg-background text-primary flex items-center justify-between p-3">
            <div className="flex items-center gap-4">
              <SvgIcon name="seats" className="w-4 h-4" />
              <p>Remaining seats</p>
            </div>
            <p className="text-primary-500">{bus.remainingSeats ?? '--'}</p>
          </li>
        </ul>

        {/* Bus details */}
        <ul className="flex flex-col gap-4">
          <li className="flex items-center justify-between">
            <p className="text-gray-500">Plate number</p>
            <p className="font-medium">{bus.plateNumber || '--'}</p>
          </li>
          <li className="flex items-center justify-between">
            <p className="text-gray-500">Color</p>
            <p>{bus.color || '--'}</p>
          </li>
          <li className="flex items-center justify-between">
            <p className="text-gray-500">Bus type</p>
            <p>{bus.busType || '--'}</p>
          </li>
          <li className="flex items-center justify-between">
            <p className="text-gray-500">Year</p>
            <p>{bus.year || '--'}</p>
          </li>
          <li className="flex items-center justify-between">
            <p className="text-gray-500">Available seats</p>
            <p>{bus.availableSeats || '--'}</p>
          </li>
          {bus.pickupDate && (
            <li className="flex items-center justify-between">
              <p className="text-gray-500">Pickup date</p>
              <p>{dayjs(bus.pickupDate).format(DAY_MONTH_FORMAT)}</p>
            </li>
          )}
        </ul>

        {/* Pickup stops */}
        {bus.pickupLocations?.length > 0 && (
          <div>
            <p className="text-gray-500 text-sm font-medium mb-2">
              Pickup stops
            </p>
            <ul className="flex flex-col gap-2">
              {bus.pickupLocations.map((stop, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between text-sm bg-gray-50 rounded-8 px-3 py-2"
                >
                  <span>{stop.label}</span>
                  {stop.time && (
                    <span className="text-gray-500 shrink-0 ml-2">
                      {stop.time}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Destinations */}
        {bus.destinations?.length > 0 && (
          <div>
            <p className="text-gray-500 text-sm font-medium mb-2">
              Destination
            </p>
            <div className="text-sm bg-gray-50 rounded-8 px-3 py-2">
              {bus.destinations[0].label}
            </div>
          </div>
        )}

        {/* Drop offs (return trip) */}
        {bus.departureLocations?.length > 0 && (
          <div>
            <p className="text-gray-500 text-sm font-medium mb-2">Drop offs</p>
            <ul className="flex flex-col gap-2">
              {bus.departureLocations.map((stop, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between text-sm bg-gray-50 rounded-8 px-3 py-2"
                >
                  <span>{stop.label}</span>
                  {stop.time && (
                    <span className="text-gray-500 shrink-0 ml-2">
                      {stop.time}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* ── Right panel — bookings table ────────────────────────── */}
      <div className="bg-background rounded-12 p-5 flex-1">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Date booked</th>
                <th>Passenger</th>
              </tr>
            </thead>
            <tbody>
              {bus.passengers?.length > 0 ? (
                bus.passengers.map((el, index) => (
                  <tr key={index}>
                    <td>
                      <div>
                        <p>{dayjs(el.dateBooked).format(DAY_MONTH_FORMAT)}</p>
                        <p className="text-gray-500">
                          {dayjs(el.dateBooked).format(TIME_FORMAT_HM)}
                        </p>
                      </div>
                    </td>
                    <td className="flex items-center gap-2">
                      <Image
                        src={el.photo || '/assets/profile-pic.png'}
                        alt="profile-pic"
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                      />
                      <div>
                        <p className="capitalize">{el.name}</p>
                        <p className="text-gray-500">{el.email}</p>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="text-center text-gray-400 py-8">
                    No bookings yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default BusProfile;
