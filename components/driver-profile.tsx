'use client';

import dayjs from 'dayjs';
import Image from 'next/image';
import { useState } from 'react';
import { Description, Title } from '@radix-ui/react-dialog';
import { Close } from '@radix-ui/react-popover';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import RideDetails from '@/components/ride-details';
import RideHistory from '@/components/ride-history-card';
import Tabs from '@/components/tabs';

import { DATE_FORMAT_DMY } from '@/lib/constants';
import { calculateAge } from '@/utils/calculate-age';
import { Driver } from '@/types/driver.type';

import ShowView from './show-view';
import DocumentLink from './document-link';
import { RideHistoryResponse } from '@/types/trip.type';
import SvgIcon from './svg-icon';
import NoDataCard from './no-data-card';
import { EmergencyContact } from '@/actions/getEmergencyContact';
import Popover from './popover';
import { Button } from './button';
import StatusTag from './status-tag';
import Modal from './modal-component';
import { toggleUserStatus } from '@/actions/toggleUserStatus';

interface DriverProfile {
  driver: Driver;
  rideHistory: RideHistoryResponse;
  emergencyContact: EmergencyContact[];
}

const DriverProfile = ({
  driver,
  rideHistory,
  emergencyContact,
}: DriverProfile) => {
  const [showEmergencyContacts, setShowEmergencyContacts] = useState(false);
  const vehicles = driver?.vehicles ?? [];
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(
    vehicles.length > 0 ? vehicles[0].vehicleId : null
  );
  const [blockingUserId, setBlockingUserId] = useState<string | null>(null);
  const router = useRouter();

  const selectedVehicle =
    (driver?.vehicles &&
      driver?.vehicles.find((v) => v.vehicleId === selectedVehicleId)) ??
    null;
  const trips = rideHistory.trips;

  const age = calculateAge(driver.dateOfBirth || '');

  const handleBlock = async (userId: string, close: () => void) => {
    try {
      setBlockingUserId(userId);
      const res = await toggleUserStatus(userId);

      if (res?.success) {
        toast.success(res.message || 'Driver blocked');
        close();
        router.refresh();
      } else {
        toast.error(res.message || 'Failed to block driver');
      }
    } catch (err: unknown) {
      console.error('Block request failed', err);
      toast.error('Unexpected error. Try again.');
    } finally {
      setBlockingUserId(null);
    }
  };

  return (
    <div className="flex max-lmd:flex-col [&>div]:flex-1 gap-5">
      <div className="dashboard-card mt-8 lmd:max-w-[380px] lmd:mt-0">
        <div className="relative flex justify-between items-center mb-8">
          <div className="relative w-[73px] h-12">
            <div className="absolute w-12 h-12 z-3 rounded-full">
              <Image
                src="/assets/profile-pic.png"
                alt="profile picture"
                fill
                sizes="100%"
                className="object-contain"
              />
            </div>

            <div className="absolute w-12 h-12 left-7 top-0 rounded-full">
              <Image
                src="/assets/default-church-logo.png"
                alt="profile picture"
                fill
                sizes="100%"
                className="object-contain"
              />
            </div>
          </div>

          <Popover
            trigger={
              <Button variant="outline">
                Actions
                <SvgIcon name="arrow-down" className="w-5 h-5" />
              </Button>
            }
          >
            <div className="option-menu">
              <Close asChild>
                <button>
                  <SvgIcon name="message-text" />
                  <p>Message</p>
                </button>
              </Close>

              <Modal
                trigger={
                  <Close asChild>
                    <button>
                      <SvgIcon name="user-minus" className="text-error-700" />
                      <p className="text-error-700">
                        {driver.isActive ? 'Block' : 'Unblock'}
                      </p>
                    </button>
                  </Close>
                }
                hideCloseButton
              >
                {(close) => {
                  const confirmLabel = driver.isActive ? 'Block' : 'Unblock';
                  const inProgressLabel = driver.isActive
                    ? 'Blocking...'
                    : 'Unblocking...';
                  return (
                    <div className="bg-background rounded-20 p-6 xsm:p-10 text-center max-w-a-500 mx-auto">
                      <button
                        onClick={close}
                        aria-label="Close dialog"
                        className="mb-4 mx-auto block bg-transparent border-0"
                        type="button"
                      >
                        <Image
                          src="/assets/user-remove.png"
                          alt="block-user-icon"
                          width={60}
                          height={60}
                          priority
                        />
                      </button>

                      <Title className="text-3xl font-semibold mb-2">
                        {driver.isActive ? 'Block Driver' : 'Unblock Driver'}
                      </Title>
                      <Description className="text-gray-400">
                        What action would you like to take?
                      </Description>

                      <div className="flex justify-between gap-2 xsm:gap-5 xxs:w-max items-center flex-wrap mx-auto mt-10">
                        <Button
                          variant="gray"
                          className="xsm:px-8 xsm:py-3"
                          onClick={close}
                        >
                          Cancel
                        </Button>

                        <Button
                          variant={driver.isActive ? 'danger' : 'default'}
                          className="xsm:px-8 xsm:py-3"
                          onClick={() => handleBlock(driver.userId, close)}
                          disabled={blockingUserId === driver.userId}
                        >
                          {blockingUserId === driver.userId
                            ? inProgressLabel
                            : confirmLabel}
                        </Button>
                      </div>
                    </div>
                  );
                }}
              </Modal>
            </div>
          </Popover>
        </div>

        <div className="mb-8">
          <p className="dashboard-heading-text">{`${driver.firstName} ${driver.lastName}`}</p>
          <div className="text-a-12 text-gray-500 mt-2 flex items-center">
            <p>{driver?.department?.name || '--'}</p>

            <span className="mx-1 inline-flex items-center justify-center h-4 w-4 text-base">
              &middot;
            </span>

            <p>{driver?.attendanceDuration || '--'}</p>
          </div>
          <div className="mt-2">
            <StatusTag
              danger={!driver.isActive}
              text={driver.isActive ? 'Active' : 'Blocked'}
            />
          </div>
        </div>

        <Tabs
          tabsStyle="flex-wrap"
          tabs={[
            {
              label: 'Personal ',
              content: (
                <>
                  <ul className="">
                    <li className="dashboard-list-item">
                      <p>First name:</p>
                      <p>{driver.firstName}</p>
                    </li>
                    <li className="dashboard-list-item">
                      <p>Last name:</p>
                      <p>{driver.lastName}</p>
                    </li>
                    <li className="dashboard-list-item">
                      <p>Email:</p>
                      <p>{driver.email}</p>
                    </li>

                    <li className="dashboard-list-item">
                      <p>Gender:</p>
                      <p className="capitalize">{driver.gender || '--'}</p>
                    </li>
                    <li className="dashboard-list-item">
                      <p>Age:</p>
                      <p>
                        {driver.dateOfBirth
                          ? `${age} years (${dayjs(driver.dateOfBirth).format(DATE_FORMAT_DMY)})`
                          : '--'}
                      </p>
                    </li>
                    <li className="dashboard-list-item capitalize">
                      <p>Home address:</p>
                      <p>{driver.homeAddress || '--'}</p>
                    </li>
                  </ul>

                  <div className="mt-4">
                    <div className="flex items-center mb-3">
                      <SvgIcon name="emergency" />
                      <p className="ml-1 font-medium">Emergency</p>
                      <button
                        className="ml-auto"
                        onClick={() =>
                          setShowEmergencyContacts((prev) => !prev)
                        }
                      >
                        <SvgIcon name="arrow-down" />
                      </button>
                    </div>

                    <ShowView when={showEmergencyContacts}>
                      <div className="flex gap-4 flex-wrap rounded-12 bg-gray-25 p-3 border border-gray-100">
                        {emergencyContact.map((el, idx) => (
                          <article
                            key={el?.contactId ?? idx}
                            className="w-full"
                            aria-labelledby={`ec-${idx}-title`}
                          >
                            <dl className="grid grid-cols-[110px_1fr] gap-4 items-start">
                              <dt className="text-gray-500">Full name</dt>
                              <dd className="min-w-0 wrap-break-word whitespace-normal">
                                {el?.fullName ?? '—'}
                              </dd>

                              <dt className="text-gray-500">Relationship</dt>
                              <dd className="min-w-0 wrap-break-word whitespace-normal capitalize">
                                {el?.relationship ?? '—'}
                              </dd>

                              <dt className="text-gray-500">Phone number</dt>
                              <dd className="min-w-0 wrap-break-word whitespace-normal">
                                {el?.phoneNumber ?? '—'}
                              </dd>

                              <dt className="text-gray-500">Email</dt>
                              <dd className="min-w-0 wrap-break-word whitespace-normal">
                                {el?.email ?? '—'}
                              </dd>

                              <dt className="text-gray-500">House</dt>
                              <dd className="min-w-0 wrap-break-word whitespace-normal">
                                {el?.address ?? '—'}
                              </dd>
                            </dl>
                          </article>
                        ))}
                      </div>
                    </ShowView>
                  </div>
                </>
              ),
            },
            {
              label: 'Car info',
              content: (
                <>
                  <div className="flex justify-between overflow-x-auto gap-2">
                    {/* Left: selected vehicle summary */}
                    <div className="flex items-start gap-3">
                      <div className="text-a-14">
                        <p className="bg-gray-100 my-1 py-1 px-2 rounded w-max text-a-14 font-medium border border-dashed border-gray-300">
                          {selectedVehicle?.plateNumber || '--'}
                        </p>
                        <p className="capitalize">
                          {selectedVehicle?.carModel || '--'}
                        </p>
                      </div>
                    </div>

                    {/* Right: thumbnails for each vehicle */}
                    <div className="flex gap-3 items-center mr-2">
                      {driver?.vehicles?.length ? (
                        driver.vehicles.map((el) => {
                          const isSelected = el.vehicleId === selectedVehicleId;
                          return (
                            <button
                              key={el.vehicleId}
                              type="button"
                              onClick={() => setSelectedVehicleId(el.vehicleId)}
                              className={`relative rounded overflow-hidden w-24 aspect-video ${isSelected ? 'ring-2 ring-primary-500' : ''}`}
                              aria-pressed={isSelected}
                            >
                              <Image
                                src="/assets/car.png"
                                alt="vehicle image"
                                fill
                                sizes="160px"
                                className="object-contain"
                              />
                            </button>
                          );
                        })
                      ) : (
                        <div className="text-sm text-gray-500">No vehicles</div>
                      )}
                    </div>
                  </div>

                  {/* Details list for the selected vehicle */}
                  <ul className="mt-4">
                    <li className="dashboard-list-item">
                      <p>Plate number:</p>
                      <p>{selectedVehicle?.plateNumber || '—-'}</p>
                    </li>
                    <li className="dashboard-list-item">
                      <p>Car model:</p>
                      <p>{selectedVehicle?.carModel || '—-'}</p>
                    </li>
                    <li className="dashboard-list-item">
                      <p>Year:</p>
                      <p>{selectedVehicle?.year || '—-'}</p>
                    </li>
                    <li className="dashboard-list-item">
                      <p>Color:</p>
                      <p>{selectedVehicle?.color || '—-'}</p>
                    </li>
                  </ul>
                </>
              ),
            },

            {
              label: 'Safety Check',
              content: (
                <>
                  <div className="flex justify-between overflow-x-auto gap-2">
                    <div className="flex items-start gap-3">
                      <div className="text-a-14">
                        <p className="bg-gray-100 my-1 py-1 px-2 rounded w-max text-a-14 font-medium border border-dashed border-gray-300">
                          {selectedVehicle?.plateNumber || '--'}
                        </p>
                        <p>{selectedVehicle?.carModel || '--'}</p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-center mr-2">
                      {driver.vehicles?.length ? (
                        driver.vehicles.map((el) => {
                          const isSelected = el.vehicleId === selectedVehicleId;
                          return (
                            <button
                              key={el.vehicleId}
                              type="button"
                              onClick={() => setSelectedVehicleId(el.vehicleId)}
                              className={`relative rounded overflow-hidden w-24 aspect-video ${isSelected ? 'ring-2 ring-primary-500' : ''}`}
                              aria-pressed={isSelected}
                            >
                              <Image
                                src="/assets/car.png"
                                alt="vehicle image"
                                fill
                                sizes="160px"
                                className="object-contain"
                              />
                            </button>
                          );
                        })
                      ) : (
                        <div className="text-sm text-gray-500">No vehicles</div>
                      )}
                    </div>
                  </div>

                  <ul className="">
                    <li className="dashboard-list-item">
                      <p>Owner of the car?:</p>
                      <p className="ml-auto">
                        {driver.driverDocuments?.carInfo?.isOwner
                          ? 'Yes'
                          : '--'}
                      </p>
                    </li>
                    <li className="dashboard-list-item">
                      <p>Clearance to drive this car?:</p>
                      <p className="ml-auto">
                        {' '}
                        {driver.driverDocuments?.carInfo?.clearanceToDrive
                          ? 'Yes'
                          : '--'}
                      </p>
                    </li>
                    <li className="dashboard-list-item">
                      <p>Driver’s license:</p>
                      <div className="flex flex-col items-end ml-auto">
                        <ShowView
                          when={
                            !!selectedVehicle?.documents?.driverLicense?.fileUrl
                          }
                          fallback={<p className="text-primary-500">--</p>}
                        >
                          <DocumentLink
                            url={
                              selectedVehicle?.documents?.driverLicense?.fileUrl
                            }
                            label="Driver's license"
                          />
                        </ShowView>

                        <p>
                          <span>
                            {dayjs(
                              selectedVehicle?.documents?.driverLicense
                                ?.issuanceDate
                            ).format('DD/MM/YY')}
                          </span>
                          <span>{` - `}</span>
                          <span>
                            {dayjs(
                              selectedVehicle?.documents?.driverLicense
                                ?.expiryDate
                            ).format('DD/MM/YY')}
                          </span>
                        </p>
                      </div>
                    </li>

                    <li className="dashboard-list-item">
                      <p>Car insurance:</p>
                      <div className="flex flex-col items-end ml-auto">
                        <ShowView
                          when={
                            !!selectedVehicle?.documents?.carInsurance?.fileUrl
                          }
                          fallback={<p className="text-primary-500">--</p>}
                        >
                          <DocumentLink
                            url={
                              selectedVehicle?.documents?.carInsurance?.fileUrl
                            }
                            label="Car insurance"
                          />
                        </ShowView>

                        <p>
                          <span>
                            {dayjs(
                              selectedVehicle?.documents?.carInsurance
                                ?.issuanceDate
                            ).format('DD/MM/YY')}
                          </span>
                          <span>{` - `}</span>
                          <span>
                            {dayjs(
                              selectedVehicle?.documents?.carInsurance
                                ?.expiryDate
                            ).format('DD/MM/YY')}
                          </span>
                        </p>
                      </div>
                    </li>
                    <li className="dashboard-list-item">
                      <p>Certificate of ownership:</p>
                      <div className="flex flex-col items-end ml-auto">
                        <ShowView
                          when={
                            !!selectedVehicle?.documents?.certificateOfOwnership
                              ?.fileUrl
                          }
                          fallback={<p className="text-primary-500">--</p>}
                        >
                          <DocumentLink
                            url={
                              selectedVehicle?.documents?.certificateOfOwnership
                                ?.fileUrl
                            }
                            label="Certificate of ownership"
                          />
                        </ShowView>

                        <p>
                          <span>
                            {dayjs(
                              selectedVehicle?.documents?.certificateOfOwnership
                                ?.issuanceDate
                            ).format('DD/MM/YY')}
                          </span>
                          <span>{` - `}</span>
                          <span>
                            {dayjs(
                              selectedVehicle?.documents?.certificateOfOwnership
                                ?.expiryDate
                            ).format('DD/MM/YY')}
                          </span>
                        </p>
                      </div>
                    </li>
                    <li className="dashboard-list-item">
                      <p>Road worthiness:</p>
                      <div className="flex flex-col items-end ml-auto">
                        <ShowView
                          when={
                            !!selectedVehicle?.documents?.roadWorthiness
                              ?.fileUrl
                          }
                          fallback={<p className="text-primary-500">--</p>}
                        >
                          <DocumentLink
                            url={
                              selectedVehicle?.documents?.roadWorthiness
                                ?.fileUrl
                            }
                            label="Road worthiness"
                          />
                        </ShowView>

                        <p>
                          <span>
                            {dayjs(
                              selectedVehicle?.documents?.roadWorthiness
                                ?.issuanceDate
                            ).format('DD/MM/YY')}
                          </span>
                          <span>{` - `}</span>
                          <span>
                            {dayjs(
                              selectedVehicle?.documents?.roadWorthiness
                                ?.expiryDate
                            ).format('DD/MM/YY')}
                          </span>
                        </p>
                      </div>
                    </li>
                  </ul>
                </>
              ),
            },
          ]}
        ></Tabs>
      </div>

      <div className="dashboard-card">
        <p className="dashboard-heading-text">Profile</p>

        <Tabs
          defaultValue="Tab 1"
          tabs={[
            {
              label: 'Ride history',
              content: (
                <>
                  <ShowView when={trips.length === 0}>
                    <NoDataCard heading="No trips yet" description={''} />
                  </ShowView>
                  <ShowView when={trips.length > 0}>
                    <ul>
                      {trips.map((trip, i) => (
                        <li key={i}>
                          <RideHistory rideHistory={trip} />
                        </li>
                      ))}
                    </ul>
                  </ShowView>
                </>
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

export default DriverProfile;
