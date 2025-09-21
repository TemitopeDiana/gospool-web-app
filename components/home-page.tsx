'use client';
import Link from 'next/link';
import { useTransition } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/button';
import Modal from '@/components/modal';
import SvgIcon from '@/components/svg-icon';
import Drawer from './drawer';
import CreateChurchForm from './forms/create-church.form';
import HoverCard from './hover-card';

import { deleteChurchAction } from '@/actions/deleteChurch';
import { toggleChurchStatus } from '@/actions/toggleChurchStatus';
import { routes } from '@/lib/routes';
import { Church } from '@/types/church.type';
import { IconName } from '@/types/icon.type';

interface UserShape {
  user?: { firstName?: string; lastName?: string } | null;
}

interface HomePageProps {
  user: UserShape | null;
  churchData: Church[];
  totalChurches: number;
  totalRides: number;
  totalDrivers: number;
  totalPassengers: number;
}

const HomePage = ({
  user,
  totalChurches,
  totalRides,
  totalDrivers,
  totalPassengers,
  churchData,
}: HomePageProps) => {
  const [isPending, startTransition] = useTransition();

  const cards = [
    { name: 'churches', iconName: 'church' as IconName, count: totalChurches },
    { name: 'Rides', iconName: 'routing' as IconName, count: totalRides },
    { name: 'Drivers', iconName: 'car' as IconName, count: totalDrivers },
    {
      name: 'Passengers',
      iconName: 'profile' as IconName,
      count: totalPassengers,
    },
  ];

  return (
    <div>
      <div className="w-full md:mt-[23px]">
        <div className="xsm:flex justify-between items-center">
          <div>
            <h1 className="text-xl font-medium mb-2 md:text-3xl">
              Welcome
              <span className="capitalize">{` ${user?.user?.firstName} ${user?.user?.lastName}`}</span>
            </h1>
            <p className="text-gray-500 text-xs md:text-base">
              Admin - Gospool
            </p>
          </div>

          <Drawer
            trigger={
              <Button className="block capitalize mb-2 mt-2 ml-auto xsm:m-0">
                Add Church
              </Button>
            }
            title="Create Church Profile"
            description="Enter details to begin"
          >
            {(close) => (
              <div>
                <CreateChurchForm close={close} />
              </div>
            )}
          </Drawer>
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
                  <p className="font-medium text-xl">{card.count}</p>
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
                {churchData?.map((el, index) => (
                  <tr key={index}>
                    <td className="capitalize">{el.name}</td>
                    <td className="py-6 px-3 capitalize">{el.adminName}</td>
                    <td>{el.totalBranches}</td>
                    <td>
                      <button
                        className={`${el.status === 'active' ? 'bg-green-500 active' : 'bg-gray-100'} toggle-button`}
                      ></button>
                    </td>
                    <td>
                      <HoverCard
                        trigger={
                          <button className="block w-max ml-auto">
                            <SvgIcon name="dotted-menu" className="w-7 h-5" />
                          </button>
                        }
                        align="end"
                      >
                        <ul className="table-action-popover">
                          <li>
                            <Link
                              href={`${routes.churchProfile(el.uniqueIdentifier)}`}
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
                                <button className="flex items-center gap-2">
                                  <SvgIcon name="trash" className="h-4 w-4" />
                                  Delete
                                </button>
                              }
                              title={el.name}
                              description="Current members will need to update their church. Prefer to disable it instead?"
                              iconName="trash"
                              iconSizeClassName="w-8 h-8 text-error-700"
                              maxWidthClassName="max-w-[442px]"
                              iconContainerClassName="w-18 h-18 rounded-40 bg-error-50 flex items-center justify-center"
                            >
                              {(close) => (
                                <div className="w-full mt-10 flex flex-wrap [&_button]:flex-1 gap-2 md:gap-3 xss:justify-center xss:flex-nowrap">
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
                                    loading={isPending}
                                    onClick={() => {
                                      startTransition(async () => {
                                        const result = await toggleChurchStatus(
                                          el.churchId
                                        );

                                        if (result.success) {
                                          toast.success(result.message);
                                          close();
                                        } else {
                                          toast.error(result.message);
                                        }
                                      });
                                    }}
                                  >
                                    Disable
                                  </Button>
                                  <Button
                                    variant="danger"
                                    className="block py-[13.5px] md:px-7"
                                    loading={isPending}
                                    onClick={() => {
                                      startTransition(async () => {
                                        const result = await deleteChurchAction(
                                          el.churchId
                                        );

                                        if (result.success) {
                                          toast.success(
                                            'Church deleted successfully'
                                          );
                                          close();
                                        } else {
                                          toast.error(result.message);
                                        }
                                      });
                                    }}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              )}
                            </Modal>
                          </li>
                        </ul>
                      </HoverCard>
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
};

export default HomePage;
