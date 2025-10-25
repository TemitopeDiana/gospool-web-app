import dayjs from 'dayjs';
import Image from 'next/image';

import SvgIcon from './svg-icon';
import Drawer from './drawer';
import Modal from './modal';
import ToolTip from './tooltip';
import StarRating from './start-rating';

import Trip from '@/types/trip.type';
import { GoogleMapsEmbed } from '@next/third-parties/google';
import { DATE_FORMAT_MON_DAY, TIME_FORMAT_HM } from '@/lib/constants';

interface RideHistoryProps {
  rideHistory: Trip;
}

const RideHistory = ({ rideHistory }: RideHistoryProps) => {
  return (
    <Drawer
      trigger={
        <div className="flex gap-3 py-3">
          <div className="px-3 mt-2">
            <SvgIcon name="car" className="w-7 h-7" />
          </div>

          <div className="flex gap-4 text-gray-400">
            <div className="flex-1">
              <div className="location-info before:border-primary font-medium pb-2 isolate text-gray-800 before:mt-1 ">
                <span className="absolute w-1 left-[5px] h-full border-l-2 border-dotted top-3.5 border-primary -z-1"></span>
                <span className="line-clamp-1">
                  {rideHistory?.startLocation.address || '--'}
                </span>
              </div>
              <p className="location-info before:border-gray-900 before:mt-[2px]">
                <span className="line-clamp-1">
                  {rideHistory?.destination.address || '--'}
                </span>
              </p>
            </div>

            <p>
              {rideHistory?.eventDate
                ? dayjs(rideHistory?.eventDate).format('MMM DD')
                : '--'}
            </p>
          </div>
        </div>
      }
      title="Ride details"
      description=""
    >
      <div>
        <div className="flex items-center justify-between gap-1 sm:gap-3">
          <div className="flex items-start">
            <div className="relative w-12 h-12 mr-2 flex-shrink-0">
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
                  Abraham
                </p>
                <div className="bg-gray-100 p-1 rounded-[4px] w-fit border border-b border-gray-300 border-4-4-dashed">
                  <p className="text-gray-900 font-medium">ABC-123BC</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">White Toyota Matrix</p>
            </div>
          </div>

          <div className="relative w-24 xxs:w-[121px] h-18 flex-shrink-0">
            <Image src="/assets/car.png" alt="car-image" fill sizes="100%" />
          </div>
        </div>

        <div className="mt-6 rounded-8 overflow-hidden">
          <GoogleMapsEmbed
            apiKey={process.env.NEXT_PUBLIC_PLACES_API_KEY as string}
            mode="place"
            width="100%"
            height={100}
            zoom="15"
            q="Lagos"
            allowfullscreen
            style="h-full"
          />
        </div>

        <div className="flex mt-3 justify-between items-end">
          <div className="flex ">
            <SvgIcon name="ellipse" className="text-primary h-4 w-4 mr-3" />

            <div className="flex items-end justify-between">
              <div>
                <p className="text-gray-500">Leaving from</p>
                <ToolTip
                  content=" 1234 Ahmadu Bello Way 1234 Ahmadu Bello Way 1234 Ahmadu Bello Way"
                  trigger={
                    <p className="mt-2 max-w-40 xsm:max-w-80 truncate">
                      {rideHistory?.startLocation.address || '--'}
                    </p>
                  }
                />
              </div>
            </div>
          </div>

          <div className="text-xs">
            {rideHistory?.eventDate
              ? dayjs(rideHistory?.eventDate).format(DATE_FORMAT_MON_DAY)
              : '--'}
            {dayjs('2024-12-25T10:00:00Z').format(DATE_FORMAT_MON_DAY)}
            {','}
            <span>
              {rideHistory?.departureTime
                ? dayjs(rideHistory?.departureTime).format(TIME_FORMAT_HM)
                : '--'}
              {dayjs(rideHistory?.departureTime).format(TIME_FORMAT_HM)}
            </span>
          </div>
        </div>

        <div className="flex mt-3 justify-between items-end">
          <div className="flex ">
            <SvgIcon name="ellipse" className="text-primary h-4 w-4 mr-3" />

            <div className="flex items-end justify-between">
              <div>
                <p className="text-gray-500">Going to</p>
                <ToolTip
                  content=" 1234 Ahmadu Bello Way 1234 Ahmadu Bello Way 1234 Ahmadu Bello Way"
                  trigger={
                    <p className="mt-2 max-w-40 xsm:max-w-80 truncate">
                      {rideHistory?.destination.address || '--'}
                    </p>
                  }
                />
              </div>
            </div>
          </div>

          <div className="text-xs">
            --, <span>--</span>
          </div>
        </div>
        <div className="mt-6 font-medium">
          <p className="mb-5">Passengers</p>

          <Modal
            trigger={
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <Image
                      src="/assets/profile-pic.png"
                      alt="passenger-pic"
                      fill
                      sizes="100%"
                    />
                  </div>
                  <div>
                    <p className="capitalize font-medium mb-2">cynthia</p>
                    <p className="text-gray-500">
                      Pick up:{' '}
                      <span className="text-gray-800">Omole phase II</span>
                      <span className="ml-1">12:30</span>
                    </p>
                  </div>
                </div>
                <StarRating rating={4.1} />
              </div>
            }
            title="Email Cynthia"
            description=""
          >
            <div className="mt-5">
              <div className="flex items-start">
                <div className="relative w-11 h-11 mr-2 flex-shrink-0 ">
                  <Image
                    src="/assets/profile-pic.png"
                    alt="passenger-pic"
                    fill
                    sizes="100%"
                  />
                </div>

                <div>
                  <p className="capitalize font-medium">Cynthia daniels</p>
                  <p className="capitalize text-gray-500 text-left">Driver</p>
                </div>
              </div>

              <div className="text-left mt-5">
                <p>Title</p>
                <div className="flex flex-1 gap-2 items-center px-3 bg-gray-50 rounded-8 mt-4">
                  <input
                    type="search"
                    name=""
                    id=""
                    className="flex-1 min-w-0 py-2"
                    placeholder="Type"
                  />
                  <SvgIcon
                    name="arrow-down"
                    className="w-4 h-4 text-gray-500"
                  />
                </div>
                <textarea
                  name=""
                  id=""
                  placeholder="Leave Abraham a message"
                  className="w-full mt-4 bg-gray-50 p-4 h-40 rounded-8"
                ></textarea>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </Drawer>
  );
};

export default RideHistory;
