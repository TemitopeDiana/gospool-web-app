'use client';
import Link from 'next/link';

import Popover from '@/components/popover';
import SvgIcon from '@/components/svg-icon';
import { IconName } from '@/types/icon.type';
import { Button } from '@/components/button';
import { routes } from '@/lib/routes';
import Modal from '@/components/modal';

const churchData = [
  {
    name: 'apostolic faith',
    churchOwner: 'grace ruth',
    branches: '4',
    status: 'active',
  },
  {
    name: 'apostolic faith',
    churchOwner: 'grace ruth',
    branches: '4',
    status: 'inactive',
  },
  {
    name: 'apostolic faith',
    churchOwner: 'grace ruth',
    branches: '4',
    status: 'active',
  },
  {
    name: 'apostolic faith',
    churchOwner: 'grace ruth',
    branches: '4',
    status: 'inactive',
  },
];

const cards: { name: string; iconName: IconName; number: number }[] = [
  { name: 'churches', iconName: 'church', number: 12 },
  { name: 'Rides', iconName: 'routing', number: 9 },
  { name: 'Drivers', iconName: 'car', number: 24 },
  { name: 'Passengers', iconName: 'profile', number: 3 },
];

export default function Home() {
  return (
    <div>
      <div className="w-full md:mt-[23px]">
        <div className="xsm:flex justify-between items-center">
          <div>
            <h1 className="text-xl font-medium mb-2 md:text-3xl">
              Welcome, Inioluwa Soetan
            </h1>
            <p className="text-gray-500 text-xs md:text-base">
              Admin - Gospool
            </p>
          </div>

          <Link href={routes.createChurchProfile()}>
            <Button
              variant="default"
              className="block capitalize mb-2 mt-2 ml-auto xsm:m-0"
            >
              new church
            </Button>
          </Link>
        </div>

        {/* cards  */}
        <div className="max-w-screen mt-4 md:mt-[35px] pb-3 flex items-center overflow-x-auto gap-4 snap-x snap-mandatory">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="flex-1 h-24 rounded-xl snap-start bg-background py-[22.5px] px-3"
            >
              <div className="flex items-center justify-between gap-[26px]">
                <div>
                  <p className="text-gray-500 text-sm mb-1 capitalize">
                    {card.name}
                  </p>
                  <p className="font-medium text-xl">{card.number}</p>
                </div>
                <div className="w-[46px] h-[46px] bg-gray-50 rounded-40 flex items-center justify-center">
                  <SvgIcon name={card.iconName} className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* table  */}
        <div className="dashboard-card mt-5">
          <div className="flex justify-between gap-4 mb-4">
            <div className="flex flex-1 gap-2 items-center px-3 bg-gray-50 rounded-xl w-35 max-w-a-300">
              <SvgIcon name="search" className="w-5 h-5 text-gray-500" />
              <input
                type="search"
                name=""
                id=""
                className="flex-1 min-w-0 py-2"
                placeholder="Search"
              />
            </div>

            <div className="flex flex-1 w-max gap-2 justify-between items-center px-3  bg-gray-50 rounded-xl max-w-30">
              All
              <SvgIcon name="arrow-down" className="w-4 h-4 text-gray-500" />
            </div>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Church owner</th>
                  <th>Branches</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {churchData.map((el, index) => (
                  <tr key={index}>
                    <td className="capitalize">{el.name}</td>
                    <td className="py-6 px-3 capitalize">{el.churchOwner}</td>
                    <td>{el.branches}</td>
                    <td>
                      <button
                        className={`${el.status === 'active' ? 'bg-green-500 active' : 'bg-gray-100'} toggle-button`}
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
                              href={`${routes.churchProfile(index.toString())}`}
                              className="flex items-center gap-2"
                            >
                              <SvgIcon
                                name="eye"
                                className="h-4 w-4 text-gray-500"
                              />
                              View
                            </Link>
                          </li>
                          <li className="text-error-700">
                            <Modal
                              trigger={
                                <Link
                                  href=""
                                  className="flex items-center gap-2"
                                >
                                  <SvgIcon name="trash" className="h-4 w-4" />
                                  Delete
                                </Link>
                              }
                              title="Remove CCI"
                              description="Current members will need to update their church. Prefer to disable it instead?"
                              iconName="trash"
                              iconSizeClassName="w-8 h-8 text-error-700"
                              maxWidthClassName="max-w-[442px]"
                              iconContainerClassName="w-18 h-18 rounded-40 bg-error-50 flex items-center justify-center"
                              onClose={() => console.log('closed')}
                            >
                              {(close) => (
                                <div className="w-full mt-10 flex flex-wrap gap-2 md:gap-3 xss:justify-center xss:flex-nowrap">
                                  <Button
                                    onClick={close}
                                    variant="outline"
                                    className="block py-[13.5px] md:px-7"
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    variant="primaryII"
                                    className="block py-[13.5px] md:px-7"
                                  >
                                    Disable
                                  </Button>
                                  <Button
                                    variant="danger"
                                    className="block py-[13.5px] md:px-7"
                                  >
                                    Remove
                                  </Button>
                                </div>
                              )}
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
      </div>
    </div>
  );
}
