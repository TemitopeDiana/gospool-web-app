'use client';

import dayjs from 'dayjs';
import Image from 'next/image';
import { useState } from 'react';

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

  const selectedVehicle =
    (driver?.vehicles &&
      driver?.vehicles.find((v) => v.vehicleId === selectedVehicleId)) ??
    null;
  const trips = rideHistory.trips;

  return (
    <div className="flex max-lmd:flex-col [&>div]:flex-1 gap-5">
      <div className="dashboard-card mt-8 lmd:max-w-[350px] lmd:mt-0">
        <div className="flex justify-between items-center">
          <div className="flex gap-3 items-center  mb-5">
            <div className="relative rounded-full w-12 aspect-square overflow-hidden">
              <Image
                src="/assets/profile-pic.png"
                alt="profile picture"
                fill
                sizes="100%"
                className="object-contain"
              />
            </div>

            <div>
              <p className="dashboard-heading-text">{`${driver.firstName} ${driver.lastName}`}</p>
              <p className="text-a-12 text-gray-500">
                {driver?.department?.name || '--'}
                <span>.</span>
                {driver?.experienceDisplay || '--'}
              </p>
            </div>
          </div>
        </div>

        <Tabs
          tabsStyle="flex-wrap"
          tabs={[
            {
              label: 'Personal details',
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
                      <p>{driver.gender || '--'}</p>
                    </li>
                    <li className="dashboard-list-item">
                      <p>Age:</p>
                      <p>
                        {driver.dateOfBirth
                          ? `${calculateAge(driver.dateOfBirth)} years (${dayjs(driver.dateOfBirth).format(DATE_FORMAT_DMY)})`
                          : '--'}
                      </p>
                    </li>
                    <li className="dashboard-list-item">
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
                      <div className="flex items-center justify-between rounded-12 bg-gray-25 p-3 border border-gray-100">
                        <ul className="flex flex-col gap-y-5 text-gray-500">
                          <li>Full name</li>
                          <li>Relationship</li>
                          <li>Phone number</li>
                          <li>Email</li>
                          <li>House</li>
                        </ul>

                        {emergencyContact.map((el, i) => (
                          <ul key={i} className="flex flex-col gap-y-5">
                            <li>{el.fullName}</li>
                            <li>{el.relationship}</li>
                            <li>{el.phoneNumber}</li>
                            <li>{el.email}</li>
                            <li>{el.address}</li>
                          </ul>
                        ))}
                      </div>
                    </ShowView>
                  </div>
                </>
              ),
            },
            {
              label: 'Car details',
              content: (
                <>
                  <div className="flex justify-between gap-3">
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
                    <div className="flex gap-3 items-center">
                      {driver.vehicles?.length ? (
                        driver.vehicles.map((el) => {
                          const isSelected = el.vehicleId === selectedVehicleId;
                          return (
                            <button
                              key={el.vehicleId}
                              type="button"
                              onClick={() => setSelectedVehicleId(el.vehicleId)}
                              className={`relative rounded overflow-hidden w-32 aspect-video ${isSelected ? 'ring-2 ring-primary-500' : ''}`}
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
                  <div className="flex justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="text-a-14">
                        <p className="bg-gray-100 my-1 py-1 px-2 rounded w-max text-a-14 font-medium border border-dashed border-gray-300">
                          {selectedVehicle?.plateNumber || '--'}
                        </p>
                        <p>{selectedVehicle?.carModel || '--'}</p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-center">
                      {driver.vehicles?.length ? (
                        driver.vehicles.map((el) => {
                          const isSelected = el.vehicleId === selectedVehicleId;
                          return (
                            <button
                              key={el.vehicleId}
                              type="button"
                              onClick={() => setSelectedVehicleId(el.vehicleId)}
                              className={`relative rounded overflow-hidden w-32 aspect-video ${isSelected ? 'ring-2 ring-primary-500' : ''}`}
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
                      <p>
                        {driver.driverDocuments?.carInfo?.isOwner
                          ? 'Yes'
                          : '--'}
                      </p>
                    </li>
                    <li className="dashboard-list-item">
                      <p>Clearance to drive this car?:</p>
                      <p>
                        {' '}
                        {driver.driverDocuments?.carInfo?.clearanceToDrive
                          ? 'Yes'
                          : '--'}
                      </p>
                    </li>
                    <li className="dashboard-list-item">
                      <p>Driver’s license:</p>
                      <div className="flex flex-col items-end">
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
                      <p>Car issuance:</p>
                      <div className="flex flex-col items-end">
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
                            label="Car issuance"
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
                      <div className="flex flex-col items-end">
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
                      <div className="flex flex-col items-end">
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
