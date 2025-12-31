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
import { getUser } from '@/actions/getUser';
import DeleteUserModal from '@/components/delete-user-modal';
import { notFound } from 'next/navigation';
import ToggleUserStatus from '@/components/toggle-user-status-modal';
import { Metadata } from 'next';
import Breadcrumb from '@/components/bread-crumbs';
import { routes } from '@/lib/routes';

type Props = {
  params: Promise<{ passengerId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { passengerId } = await params;
  const user = await getUser(passengerId);

  const fullName = user.data?.firstName + ' ' + user.data?.lastName;

  return {
    title: user.data?.firstName ? `${fullName} Profile` : undefined,
  };
}

const PassengerProfile = async ({ params }: Props) => {
  const { passengerId } = await params;
  const user = await getUser(passengerId);

  if (!user.data) {
    return notFound();
  }

  const age = calculateAge(user.data.dateOfBirth || '');

  const fullName = user.data?.firstName + ' ' + user.data?.lastName;

  console.log({ user });

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Passengers', href: routes.passengers() },
          { label: fullName },
        ]}
      />

      <div className="flex max-lmd:flex-col [&>div]:flex-1 gap-5">
        <div className="dashboard-card w-full h-max flex- lmd:max-w-87.5">
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
              <div className="option-menu">
                <ToggleUserStatus
                  trigger={
                    <button
                      className={
                        user.data.isActive ? 'text-error-700' : 'text-primary'
                      }
                    >
                      <SvgIcon name="user-minus" />
                      <p>{user.data.isActive ? 'Block' : 'Unblock'}</p>
                    </button>
                  }
                  userId={user.data.userId}
                  name={`${user.data.firstName} ${user.data.lastName}`}
                  isActive={user.data.isActive}
                />
                <DeleteUserModal
                  trigger={
                    <button>
                      <SvgIcon name="trash" className="text-error-700" />
                      <p className="text-error-700">Delete</p>
                    </button>
                  }
                  userId={user.data.userId}
                  name={`${user.data.firstName} ${user.data.lastName}`}
                  redirectTo={routes.passengers()}
                />
              </div>
            </Popover>
          </div>
          <div className="mt-8">
            <p className="dashboard-heading-text">{`${user.data.firstName} ${user.data.lastName}`}</p>
            <p className="text-gray-500">{user.data?.branch?.name || '---'}</p>
          </div>
          <ul className="">
            <li className="dashboard-list-item">
              <p>Email:</p>
              <p>{user.data?.email}</p>
            </li>
            <li className="dashboard-list-item">
              <p>Gender:</p>
              <p className="capitalize">{user.data?.gender || '---'}</p>
            </li>
            <li className="dashboard-list-item">
              <p>Age:</p>
              <p>
                {user.data.dateOfBirth
                  ? `${age} years (${dayjs(user.data?.dateOfBirth).format(DATE_FORMAT_DMY)})`
                  : '---'}
              </p>
            </li>
            <li className="dashboard-list-item">
              <p>Home Address:</p>
              <p>{user.data?.homeAddress}</p>
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
    </>
  );
};

export default PassengerProfile;
