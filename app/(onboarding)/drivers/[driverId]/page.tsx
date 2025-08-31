'use client';
import { Button } from '@/components/button';
import Modal from '@/components/modal-component';
import Popover from '@/components/popover';
import SvgIcon from '@/components/svg-icon';
import Tabs from '@/components/tabs';
import { DATE_FORMAT_DMY } from '@/lib/constants';
import { calculateAge } from '@/utils/calculate-age';
import { Description, Title } from '@radix-ui/react-dialog';
import dayjs from 'dayjs';
import Image from 'next/image';

const DriverProfile = () => {
  const birthDate = '2023-07-02';
  const age = calculateAge(birthDate);

  return (
    <div className="w-full !max-w-[676px]">
      <h1 className="dashboard-heading-text">Review Application</h1>
      <p>Please go over driver’s application thoroughly</p>

      <div className="dashboard-card mt-8">
        <div className="flex justify-between items-center">
          <div className="flex gap-3 items-center  mb-5">
            <div className="relative rounded-full w-12 aspect-square overflow-hidden">
              <Image
                src="/assets/user-icon.png"
                alt="profile picture"
                fill
                sizes="100%"
                className="object-contain"
              />
            </div>

            <div>
              <p className="dashboard-heading-text">Paul Oluwatoni</p>
              <p className="text-a-12 text-gray-500">
                Media <span>-</span> 3 years
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
                    <p>Paul</p>
                  </li>
                  <li className="dashboard-list-item">
                    <p>Last name:</p>
                    <p>Oluwatoni</p>
                  </li>
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
                    </p>
                  </li>
                  <li className="dashboard-list-item">
                    <p>Home address:</p>
                    <p>Gbagada, Lagos.</p>
                  </li>
                </ul>
              ),
            },
            {
              label: 'Car details',
              content: (
                <>
                  <div className="flex justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="text-a-14">
                        <p className="bg-gray-100 my-1 py-1 px-2 rounded w-max text-a-14 font-medium">
                          ABC-1234-DE
                        </p>
                        <p>White Benz AMG</p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-center">
                      <div className="relative rounded-full w-32 aspect-video overflow-hidden">
                        <Image
                          src="/assets/car.png"
                          alt="profile picture"
                          fill
                          sizes="100%"
                          className="object-contain"
                        />
                      </div>{' '}
                      <div className="relative rounded-full w-32 aspect-video overflow-hidden">
                        <Image
                          src="/assets/car.png"
                          alt="profile picture"
                          fill
                          sizes="100%"
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </div>

                  <ul className="">
                    <li className="dashboard-list-item">
                      <p>Plate number:</p>
                      <p>ABC-1234-DE</p>
                    </li>
                    <li className="dashboard-list-item">
                      <p>Car model:</p>
                      <p>Benz</p>
                    </li>
                    <li className="dashboard-list-item">
                      <p>Year:</p>
                      <p>2025</p>
                    </li>
                    <li className="dashboard-list-item">
                      <p>Color:</p>
                      <p>White</p>
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
                        <p className="bg-gray-100 my-1 py-1 px-2 rounded w-max text-a-14 font-medium">
                          ABC-1234-DE
                        </p>
                        <p>White Benz AMG</p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-center">
                      <div className="relative rounded-full w-32 aspect-video overflow-hidden">
                        <Image
                          src="/assets/car.png"
                          alt="profile picture"
                          fill
                          sizes="100%"
                          className="object-contain"
                        />
                      </div>{' '}
                      <div className="relative rounded-full w-32 aspect-video overflow-hidden">
                        <Image
                          src="/assets/car.png"
                          alt="profile picture"
                          fill
                          sizes="100%"
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </div>

                  <ul className="">
                    <li className="dashboard-list-item">
                      <p>Owner of the car?:</p>
                      <p>No</p>
                    </li>
                    <li className="dashboard-list-item">
                      <p>Clearance to drive this car?:</p>
                      <p>Yes</p>
                    </li>
                    <li className="dashboard-list-item">
                      <p>Driver’s license:</p>
                      <div>
                        <button className="flex gap-1 items-center text-primary-500 ml-auto">
                          <SvgIcon name="document-text" className="w-4 h-4" />
                          <p className="underline">File.png</p>
                        </button>

                        <p className="">
                          <span>{dayjs().format('DD/MM/YY')}</span>
                          <span>{` - `}</span>
                          <span>{dayjs().format('DD/MM/YY')}</span>
                        </p>
                      </div>
                    </li>

                    <li className="dashboard-list-item">
                      <p>Car issuance:</p>
                      <div>
                        <button className="flex gap-1 items-center text-primary-500 ml-auto">
                          <SvgIcon name="document-text" className="w-4 h-4" />
                          <p className="underline">File.png</p>
                        </button>

                        <p className="">
                          <span>{dayjs().format('DD/MM/YY')}</span>
                          <span>{` - `}</span>
                          <span>{dayjs().format('DD/MM/YY')}</span>
                        </p>
                      </div>
                    </li>
                    <li className="dashboard-list-item">
                      <p>Certificate of ownership:</p>
                      <div>
                        <button className="flex gap-1 items-center text-primary-500 ml-auto">
                          <SvgIcon name="document-text" className="w-4 h-4" />
                          <p className="underline">File.png</p>
                        </button>

                        <p className="">
                          <span>{dayjs().format('DD/MM/YY')}</span>
                          <span>{` - `}</span>
                          <span>{dayjs().format('DD/MM/YY')}</span>
                        </p>
                      </div>
                    </li>
                    <li className="dashboard-list-item">
                      <p>Road worthiness:</p>
                      <div className="">
                        <button className="flex gap-1 items-center text-primary-500 ml-auto">
                          <SvgIcon name="document-text" className="w-4 h-4" />
                          <p className="underline">File.png</p>
                        </button>

                        <p className="">
                          <span>{dayjs().format('DD/MM/YY')}</span>
                          <span>{` - `}</span>
                          <span>{dayjs().format('DD/MM/YY')}</span>
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

export default DriverProfile;
