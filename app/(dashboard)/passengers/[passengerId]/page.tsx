import dayjs from 'dayjs';
import Image from 'next/image';

import { Button } from '@/components/button';
import Popover from '@/components/popover';
import RideDetails from '@/components/ride-details';
// import RideHistory from '@/components/ride-history-card';
import SvgIcon from '@/components/svg-icon';
import Tabs from '@/components/tabs';
import { DATE_FORMAT_DMY } from '@/lib/constants';

import { calculateAge } from '@/utils/calculate-age';

const PassengerProfile = () => {
  const birthDate = '2023-07-02';
  const age = calculateAge(birthDate);

  return (
    <div className="flex max-lmd:flex-col [&>div]:flex-1 gap-5">
      <div className="dashboard-card w-full h-max flex- lmd:max-w-[350px]">
        <div className="flex justify-between items-center">
          <div className="relative rounded-full w-16 aspect-square overflow-hidden">
            <Image
              src="/assets/user-icon.png"
              alt="profile picture"
              fill
              sizes="100%"
              className="object-contain"
            />
          </div>

          <Popover
            trigger={
              <Button variant="outline" className="flex gap-2 items-center">
                <span className="font-semibold">Actions</span>
                <SvgIcon name="arrow-down" className="w-4 h-4" />
              </Button>
            }
          >
            <div className="option-menu">Something</div>
          </Popover>
        </div>

        <div className="mt-8">
          <p className="dashboard-heading-text">Paul Oluwatoni</p>

          <p className="text-gray-500">Gbagada</p>
        </div>

        <ul className="">
          <li className="dashboard-list-item">
            <p>Email:</p>
            <p>paul@tonnipaul.com</p>
          </li>
          <li className="dashboard-list-item">
            <p>Gender:</p>
            <p>Male</p>
          </li>
          <li className="dashboard-list-item">
            <p>Age:</p>
            <p>
              {`${age} years (${dayjs(birthDate).format(DATE_FORMAT_DMY)})`}
            </p>{' '}
          </li>
          <li className="dashboard-list-item">
            <p>ID:</p>

            <button className="flex gap-2 items-center text-primary-500">
              <SvgIcon name="document-text" className="w-5 h-5" />
              <p className="underline">file.jpg</p>
            </button>
          </li>
        </ul>
      </div>

      <div className="dashboard-card">
        <p className="dashboard-heading-text">Profile</p>

        <Tabs
          defaultValue="Tab 1"
          tabs={[
            {
              label: 'Ride history',
              content: (
                <ul>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <li key={i}>
                      {/* <RideHistory rideHistory={undefined} /> */}
                    </li>
                  ))}
                </ul>
              ),
            },
            {
              label: 'Details',
              content: <RideDetails />,
            },
          ]}
        />
      </div>
    </div>
  );
};

export default PassengerProfile;
