'use client';
import { useState } from 'react';
import Image from 'next/image';
import { GoogleMapsEmbed } from '@next/third-parties/google';

import { Button } from '@/components/button';
import Drawer from '@/components/drawer';
import SvgIcon from '@/components/svg-icon';
import Modal from '@/components/modal';
import ToolTip from '@/components/tooltip';

const buttons = ['In progress', 'Scheduled', 'History'];

const data = [
  {
    driver: {
      name: 'john moore',
      src: '/assets/profile-pic.png',
      churchLogo: '/assets/default-church-logo.png',
    },
    destination: {
      address: '1234 Ahmadu Bello way, Ikeja',
      branch: 'CCI ikeja',
    },
    departure: '9:00am',
    passengers: [
      '/assets/profile-pic.png',
      '/assets/profile-pic.png',
      '/assets/profile-pic.png',
      '/assets/profile-pic.png',
    ],
  },
];

// const data: any[] = [];

function RidesMonitoring() {
  const [activeBtn, setActiveBtn] = useState('In progress');

  return (
    <div>
      <h1 className="capitalize text-2xl md:text-3xl font-medium">
        Ride monitoring
      </h1>

      <div className="bg-background p-5 mt-5 rounded-12">
        <div className="flex items-center flex-wrap gap-2 mb-5">
          {buttons.map((el, index) => (
            <div key={index} className="w-max">
              <Button
                variant={activeBtn === el ? 'default' : 'outline'}
                className="capitalize px-3 py-[5.5px]"
                onClick={() => setActiveBtn(el)}
              >
                {el}
              </Button>
            </div>
          ))}
        </div>

        {data.length > 0 ? (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>driver</th>
                  <th>destination</th>
                  <th>departure time</th>
                  <th>passengers</th>
                </tr>
              </thead>

              <tbody>
                {data.map((el, index) => (
                  <Drawer
                    key={index}
                    trigger={
                      <tr>
                        <td>
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="flex">
                              <div className="relative w-8 h-8 z-10">
                                <Image
                                  src={el.driver.src}
                                  alt={
                                    el.driver.name
                                      ? `${el.driver.name} avatar`
                                      : 'avatar'
                                  }
                                  fill
                                  sizes="40px"
                                />
                              </div>
                              <div className="relative w-8 h-8 left-[-20%]">
                                <Image
                                  src={el.driver.churchLogo}
                                  alt="church-logo"
                                  fill
                                  sizes="40px"
                                />
                              </div>
                            </div>
                            <p className="capitalize">{el.driver.name}</p>
                          </div>
                        </td>
                        <td>
                          <div>
                            <ToolTip
                              content={el.destination.address}
                              trigger={
                                <p className="max-w-40 xsm:max-w-80 truncate">
                                  {el.destination.address}
                                </p>
                              }
                            />

                            <p className="text-gray-500 capitalize">
                              {el.destination.branch}
                            </p>
                          </div>
                        </td>
                        <td>{el.departure}</td>
                        <td>
                          <div className="flex flex-wrap items-center -space-x-1">
                            {el.passengers.map((el, index) => (
                              <div key={index} className="relative w-5 h-5">
                                <Image
                                  src={el}
                                  alt="passenger-pic"
                                  fill
                                  sizes="100%"
                                />
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    }
                    title="Ride details"
                    description=""
                  >
                    <div>
                      <h1 className="font-semibold text-gray-900 text-2xl">
                        Picking up Gabriella
                      </h1>
                      <div className="mb-6 flex items-center gap-1 mt-1">
                        <SvgIcon name="location" className="w-3 h-3" />
                        <p className="text-gray-500 text-sm">
                          1234 Ahmadu Bello way
                        </p>
                      </div>

                      <GoogleMapsEmbed
                        apiKey={
                          process.env.NEXT_PUBLIC_PLACES_API_KEY as string
                        }
                        mode="place"
                        width="100%"
                        height={200}
                        zoom="15"
                        q="Lagos"
                        allowfullscreen
                        style="h-full"
                      />

                      <div className="flex mt-8 items-center justify-between gap-1 sm:gap-3">
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
                                <p className="text-gray-900 font-medium">
                                  ABC-123BC
                                </p>
                              </div>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              White Toyota Matrix
                            </p>
                          </div>
                        </div>

                        <div className="relative w-24 xxs:w-[121px] h-18 flex-shrink-0">
                          <Image
                            src="/assets/car.png"
                            alt="car-image"
                            fill
                            sizes="100%"
                          />
                        </div>
                      </div>

                      <div className="flex mt-3 justify-between items-end">
                        <div className="flex ">
                          <SvgIcon
                            name="ellipse"
                            className="text-primary h-4 w-4 mr-3"
                          />

                          <div className="flex items-end justify-between">
                            <div>
                              <p className="text-gray-500">Leaving from</p>
                              <ToolTip
                                content=" 1234 Ahmadu Bello Way 1234 Ahmadu Bello Way 1234 Ahmadu Bello Way"
                                trigger={
                                  <p className="mt-2 max-w-40 xsm:max-w-80 truncate">
                                    1234 Ahmadu Bello Way 1234 Ahmadu Bello Way
                                    1234 Ahmadu Bello Way
                                  </p>
                                }
                              />
                            </div>
                          </div>
                        </div>

                        <div className="text-xs">
                          Feb 14, <span>12:30</span>
                        </div>
                      </div>

                      <div className="mt-6 font-medium">
                        <p className="mb-5">Passengers</p>

                        <Modal
                          trigger={
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
                                <p className="capitalize font-medium mb-2">
                                  cynthia
                                </p>
                                <p className="text-gray-500">
                                  Pick up:{' '}
                                  <span className="text-gray-800">
                                    Omole phase II
                                  </span>
                                  <span className="ml-1">12:30</span>
                                </p>
                              </div>
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
                                <p className="capitalize font-medium">
                                  Cynthia daniels
                                </p>
                                <p className="capitalize text-gray-500 text-left">
                                  Driver
                                </p>
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

                      <Modal
                        trigger={
                          <Button
                            variant="danger"
                            className="w-full flex justify-center text-background mt-15"
                          >
                            Escalate
                            <SvgIcon name="warning" className="h-5 w-5" />
                          </Button>
                        }
                        title="Raise an alarm"
                        description="Notify HOD of the issue with the ride"
                        contentCardClassName="text-left"
                      >
                        <div>
                          <p className="text-xs mt-6">Escalate to</p>
                          <div className="flex flex-1 gap-2 items-center px-3 bg-gray-50 rounded-8 mt-4">
                            <SvgIcon
                              name="search"
                              className="w-5 h-5 text-gray-500"
                            />
                            <input
                              type="search"
                              name=""
                              id=""
                              className="flex-1 min-w-0 py-2"
                              placeholder="Search"
                            />
                            <SvgIcon
                              name="arrow-down"
                              className="w-4 h-4 text-gray-500"
                            />
                          </div>
                          <textarea
                            name=""
                            id=""
                            placeholder="Describe the issue"
                            className="w-full mt-4 bg-gray-50 p-4 h-40 rounded-8"
                          ></textarea>
                          <div className="flex gap-5 justify-end mt-10">
                            <Button
                              variant="outline"
                              className="md:px-[34.5px]"
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="danger"
                              className="md:py-[13.5px] px-10 md:px-[66.5px]"
                            >
                              Send
                            </Button>
                          </div>
                        </div>
                      </Modal>
                    </div>
                  </Drawer>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="w-[146px] my-30 mx-auto text-center">
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
