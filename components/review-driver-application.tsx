'use client';

import dayjs from 'dayjs';
import Image from 'next/image';
import { useState } from 'react';

import { Button } from '@/components/button';
import Modal from '@/components/modal-component';
import Popover from '@/components/popover';
import SvgIcon from '@/components/svg-icon';
import Tabs from '@/components/tabs';
import { DATE_FORMAT_DMY } from '@/lib/constants';
import { calculateAge } from '@/utils/calculate-age';
import { Description, Title } from '@radix-ui/react-dialog';
import { Driver } from '@/types/driver.type';

import DocumentLink from './document-link';
import ShowView from './show-view';

interface IReviewDriverApplication {
  driver: Driver;
}

const ReviewDriverApplication = ({ driver }: IReviewDriverApplication) => {
  const vehicles = driver?.vehicles ?? [];

  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(
    vehicles.length > 0 ? vehicles[0].vehicleId : null
  );

  const selectedVehicle =
    (driver?.vehicles &&
      driver?.vehicles.find((v) => v.vehicleId === selectedVehicleId)) ??
    null;

  console.log(driver);

  return (
    <div className="w-full !max-w-[676px]">
      <h1 className="dashboard-heading-text">Review Application</h1>
      <p>Please go over driver’s application thoroughly</p>

      <div className="dashboard-card mt-8">
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

          <Popover
            trigger={
              <Button className="h-max">
                <p>Actions</p>
                <SvgIcon name="arrow-down" className="w-4 h-4" />
              </Button>
            }
            align="end"
          >
            <div className="option-menu">
              <button>
                <SvgIcon name="check" />
                <p>Approve</p>
              </button>

              <Modal
                trigger={
                  <button>
                    <SvgIcon name="refresh" />
                    <p>Return</p>
                  </button>
                }
                disableOutsideClick
                hideCloseButton
              >
                {(close) => (
                  <div className="px-5 py-10 bg-white rounded-20 mx-auto shadow-lg focus:outline-none md:px-10 max-w-[442px]">
                    <Title className="text-xl font-semibold mb-6 md:text-3xl capitalize">
                      Return Requests
                    </Title>

                    <Description className="text-sm text-gray-500 font-normal mb-3">
                      Share the number the specific details i
                    </Description>

                    <div>Will be completed with correct data</div>

                    <div className="flex w-full justify-between mt-10 gap-5">
                      <Button variant="outline" onClick={close}>
                        Cancel
                      </Button>

                      <Button
                        onClick={() => {
                          close();
                        }}
                      >
                        Send Message
                      </Button>
                    </div>
                  </div>
                )}
              </Modal>
              <button className="text-error-700">
                <SvgIcon name="flag" />
                <p>Reject</p>
              </button>
            </div>
          </Popover>
        </div>

        <Tabs
          tabs={[
            {
              label: 'Personal details',
              content: (
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
                      <p>Car insurance:</p>
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
    </div>
  );
};

export default ReviewDriverApplication;
