'use client';
import Image from 'next/image';
import { FormProvider, useForm } from 'react-hook-form';
import Link from 'next/link';

import { Button } from '@/components/button';
import Input from '@/components/input';
import Modal from '@/components/modal';
import SvgIcon from '@/components/svg-icon';
import Popover from '@/components/popover';

import { routes } from '@/lib/routes';
import Drawer from '@/components/drawer';
import RemoveUserIcon from '@/public/assets/user-remove.png';

// const data: any[] = [];
const data = [
  {
    bus: {
      url: '/assets/bus.png',
      color: 'white',
      numberPlate: '123-ABC',
    },
    departure: {
      location: 'charlie boy',
      time: '9:00am',
    },
    availableSeats: 23,
    presence: 'active',
  },
  {
    bus: {
      url: '/assets/bus.png',
      color: 'white',
      numberPlate: 'ASD-232',
    },
    departure: {
      location: 'charlie boy',
      time: '9:00am',
    },
    availableSeats: 23,
  },
];

function Bus() {
  const methods = useForm();

  return (
    <div className="w-full max-w-[900px] mx-auto">
      <div className="flex items-center justify-between mb-5 mt-[14px]">
        <p className="text-xl xsm:text-3xl font-medium ">Bus</p>
        <Modal
          trigger={
            <Button variant="default" className="md:px-10 md:py-[13.5px]">
              Add bus
            </Button>
          }
          title="Add bus profile"
          contentCardClassName="text-left"
          maxWidthClassName="w-[720px]"
        >
          <FormProvider {...methods}>
            <form className="mt-8">
              <div className="flex flex-col md:flex-row flex-wrap md:items-center gap-6">
                <Input
                  type="text"
                  name="bus-type"
                  label="Bus type"
                  className="flex-1"
                />
                <Input
                  type="text"
                  name="year"
                  label="Year"
                  className="flex-1"
                />
                <Input
                  type="number"
                  name="available-seats"
                  label="Available seats"
                  className="flex-1"
                />
              </div>
              <div className="flex flex-col md:flex-row flex-wrap gap-6 md:items-center mt-6 ">
                <div className="flex-1 min-w-0">
                  <Input type="text" name="plate-number" label="Plate number" />
                </div>

                <div className="flex-1 min-w-0">
                  <Input type="text" name="color" label="Color" />
                </div>
              </div>
              <Button
                variant="default"
                className="mt-8 px-[55px] py-[13.5px] ml-auto"
              >
                Add bus
              </Button>
            </form>
          </FormProvider>
        </Modal>
      </div>
      {data.length > 0 ? (
        <div className="bg-background rounded-12 p-5">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Buses</th>
                  <th>Departure</th>
                  <th>Available seats</th>
                  <th>Presence</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {data.map((el, index) => (
                  <tr key={index}>
                    <td>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Image
                          src={el.bus.url}
                          alt="bus-img"
                          width={64}
                          height={64}
                        />
                        <div>
                          <p className="capitalize">white</p>
                          <div className="bg-gray-100 p-1 rounded-[4px] w-fit border border-b border-gray-300 border-4-4-dashed">
                            <p className="text-gray-900 font-medium">
                              {el.bus.numberPlate}
                            </p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <p>{el.departure.location}</p>
                        <p>{el.departure.time}</p>
                      </div>
                    </td>
                    <td>{el.availableSeats}</td>

                    <td>
                      <button
                        className={`${el.presence === 'active' ? 'bg-green-500 active' : 'bg-gray-100'} toggle-button`}
                      ></button>
                    </td>
                    <td>
                      <Popover
                        trigger={
                          <button className="block w-max">
                            <SvgIcon name="dotted-menu" className="w-7 h-5" />
                          </button>
                        }
                      >
                        <ul className="table-action-popover">
                          <li>
                            <Link
                              href={`${routes.busProfile(index.toString())}`}
                              className="flex items-center gap-2"
                            >
                              <SvgIcon
                                name="eye"
                                className="h-4 w-4 text-gray-500"
                              />
                              View
                            </Link>
                          </li>
                          <li>
                            <Drawer
                              key={index}
                              trigger={
                                <button className="flex items-center gap-2">
                                  <SvgIcon
                                    name="edit"
                                    className="h-4 w-4 text-gray-500"
                                  />
                                  Edit
                                </button>
                              }
                              title="Edit bus details"
                              description=""
                            >
                              <div>
                                <div className="flex items-center gap-2">
                                  <Image
                                    src="/assets/profile-pic.png"
                                    alt="profile-pic"
                                    width={48}
                                    height={48}
                                  />
                                  <div>
                                    <p className="text-sm">Driver's photo</p>
                                    <p className="text-xs text-gray-500">
                                      For easier recognition
                                    </p>
                                  </div>
                                </div>

                                <FormProvider {...methods}>
                                  <form className="flex flex-col gap-5 mt-5">
                                    <Input
                                      type="text"
                                      name="driver-name"
                                      label="Driver name"
                                    />
                                    <div className="flex flex-wrap items-center gap-6">
                                      <div className="flex-1">
                                        <Input
                                          type="text"
                                          name="number-plate"
                                          label="Plate Number"
                                        />
                                      </div>
                                      <div className="flex-1">
                                        <Input
                                          type="text"
                                          name="color"
                                          label="Color"
                                        />
                                      </div>
                                    </div>
                                    <Input
                                      type="number"
                                      name="available-seats"
                                      label="Available seats"
                                    />
                                    <div className="flex items-center gap-3">
                                      <button
                                        className="toggle-button"
                                        type="button"
                                      ></button>
                                      <div>
                                        <p>Make public?</p>
                                        <p>
                                          List this bus on gospool for members
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-6 ">
                                      <div className="flex-1">
                                        <Input
                                          type="text"
                                          name="pickup-location"
                                          label="Pickup location"
                                        />
                                      </div>

                                      <div className="flex-1">
                                        <Input
                                          type="time"
                                          name="departure-time"
                                          label="Departure time"
                                        />
                                      </div>
                                    </div>
                                  </form>
                                </FormProvider>
                              </div>
                            </Drawer>
                          </li>
                          <li className="text-error-700">
                            <Modal
                              trigger={
                                <button className="flex items-center gap-2">
                                  <SvgIcon name="trash" className="h-4 w-4" />
                                  Delete
                                </button>
                              }
                              title="Remove Bus"
                              description="The bus profile will no longer exist"
                              imageURL={RemoveUserIcon}
                              imageClassName="w-15 h-15"
                            >
                              <div className="mx-auto flex flex-wrap items-center gap-5 mt-10 max-w-fit">
                                <Button
                                  variant="outline"
                                  className="xxs:py-[13.5px] xxs:px-[34.5px]"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="danger"
                                  className="xxs:py-[13.5px] xxs:px-10"
                                >
                                  Remove
                                </Button>
                              </div>
                            </Modal>
                          </li>
                        </ul>
                      </Popover>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="relative bg-background text-center h-[600px] rounded-12">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Image
              src="/assets/empty-inbox.png"
              alt="empty-inbox-image"
              width={64}
              height={64}
              className="mx-auto"
            />
            <p className="font-semibold mt-2 mb-2 text-base xsm:text-xl">
              No Bus profile yet...
            </p>
            <p className="text-gray-500 text-sm">
              Add buses for church members to easily ride with
            </p>
            <Modal
              trigger={
                <Button variant="default" className="mx-auto mt-5 capitalize">
                  add bus
                </Button>
              }
              title="Add bus profile"
              contentCardClassName="text-left"
              maxWidthClassName="w-[720px]"
            >
              <FormProvider {...methods}>
                <form className="mt-8">
                  <div className="flex flex-col md:flex-row flex-wrap md:items-center gap-6">
                    <Input
                      type="text"
                      name="bus-type"
                      label="Bus type"
                      className="flex-1"
                    />
                    <Input
                      type="text"
                      name="year"
                      label="Year"
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      name="available-seats"
                      label="Available seats"
                      className="flex-1"
                    />
                  </div>
                  <div className="flex flex-col md:flex-row flex-wrap gap-6 md:items-center mt-6 ">
                    <div className="flex-1 min-w-0">
                      <Input
                        type="text"
                        name="plate-number"
                        label="Plate number"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <Input type="text" name="color" label="Color" />
                    </div>
                  </div>
                  <Button
                    variant="default"
                    className="mt-8 px-[55px] py-[13.5px] ml-auto"
                  >
                    Add bus
                  </Button>
                </form>
              </FormProvider>
            </Modal>
          </div>
        </div>
      )}
    </div>
  );
}
export default Bus;
