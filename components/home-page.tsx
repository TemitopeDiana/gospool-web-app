'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import dayjs from 'dayjs';

import { Button } from '@/components/button';
import SvgIcon from '@/components/svg-icon';
import ConfirmActionCard from './confirm-action-card';
import Drawer from './drawer';
import CreateTeamForm from './forms/create-team.form';
import CreateChurchForm from './forms/create-church.form';
import Modal from './modal-component';
import Popover from './popover';

import { deleteChurchAction } from '@/actions/deleteChurch';
import { toggleChurchStatus } from '@/actions/toggleChurchStatus';
import { routes } from '@/lib/routes';
import { Branch, Church } from '@/types/church.type';
import { IconName } from '@/types/icon.type';
import { useRouter } from 'next/navigation';
import { TeamMember } from '@/types/user.type';

interface UserShape {
  user?: { firstName?: string; lastName?: string } | null;
}

interface HomePageProps {
  user: UserShape | null;
  churchData: Church[];
  branchData: Branch[];
  teamsData: TeamMember[];
  totalChurches: number;
  totalBranches: number;
  totalRides: number;
  totalDrivers: number;
  totalPassengers: number;
}

const GospoolAdminHomePage = ({
  user,
  totalChurches,
  totalRides,
  totalDrivers,
  totalPassengers,
  churchData,
}: Omit<HomePageProps, 'totalBranches' | 'branchData' | 'teamsData'>) => {
  const [isTogglingChurchStatus, setIsTogglingChurchStatus] = useState(false);
  const [isDeletingChurch, setIsDeletingChurch] = useState(false);

  const handleChurchStatusToggle = async (
    churchId: string,
    close: () => void
  ) => {
    setIsTogglingChurchStatus(true);

    try {
      const result = await toggleChurchStatus(churchId);

      if (result.success) {
        toast.success(result.message);
        close();
      } else {
        toast.error(result.message);
      }
    } finally {
      setIsTogglingChurchStatus(false);
    }
  };

  const handleDeleteChurch = async (churchId: string, close: () => void) => {
    setIsDeletingChurch(true);

    try {
      const result = await deleteChurchAction(churchId);

      if (result.success) {
        toast.success(result.message);
        close();
      } else {
        toast.error(result.message);
      }
    } finally {
      setIsDeletingChurch(false);
    }
  };

  const cards: {
    name: string;
    iconName: IconName;
    count: number;
  }[] = [
    { name: 'Churches', iconName: 'church', count: totalChurches },
    { name: 'Rides', iconName: 'routing', count: totalRides },
    { name: 'Drivers', iconName: 'car', count: totalDrivers },
    {
      name: 'Passengers',
      iconName: 'profile',
      count: totalPassengers,
    },
  ];

  return (
    <div>
      <div className="w-full md:mt-5.75">
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
              <Button
                type="button"
                className="block capitalize mb-2 mt-2 ml-auto xsm:m-0"
              >
                Add Church
              </Button>
            }
            title="Create Church Profile"
            description="Enter details to begin"
            disableEscapeDown
            disableOutsideClick
          >
            {(close) => <CreateChurchForm close={close} />}
          </Drawer>
        </div>

        <div className="max-w-screen mt-4 md:mt-8.75 pb-3 flex items-center overflow-x-auto gap-4 snap-x snap-mandatory">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="flex-1 h-24 rounded-xl snap-start bg-background py-[22.5px] px-3"
            >
              <div className="flex items-center justify-between gap-6.5">
                <div>
                  <p className="text-gray-500 text-sm mb-1 capitalize">
                    {card.name}
                  </p>
                  <p className="font-medium text-xl">{card.count}</p>
                </div>
                <div className="w-11.5 h-11.5 bg-gray-50 rounded-40 flex items-center justify-center">
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
                {churchData?.map((el, index) => {
                  const isActive = el.status === 'active';
                  const statusLabel = isActive ? 'Disable' : 'Enable';
                  console.log('LOGO', el.logo);
                  return (
                    <tr key={index}>
                      <td className="capitalize">
                        <div className="flex items-center gap-2">
                          <span className="relative block w-9 h-9 rounded-full aspect-square overflow-hidden ">
                            <Image
                              src={el.logo || '/assets/a.png'}
                              alt={el.name}
                              fill
                              sizes="24px"
                            />
                          </span>
                          <span className="inline-block">{el.name}</span>
                        </div>
                      </td>
                      <td className="py-6 px-3 capitalize">{el.adminName}</td>
                      <td>{el.totalBranches}</td>
                      <td>
                        <Modal
                          hideCloseButton
                          disableOutsideClick
                          trigger={
                            <button
                              className={`${isActive ? 'bg-green-500 active' : 'bg-gray-100'} toggle-button`}
                            />
                          }
                        >
                          {(close) => (
                            <ConfirmActionCard
                              close={close}
                              title={`${statusLabel} ${el.name}`}
                              icon="toggle"
                              description={`Are you sure you want to ${statusLabel} this church?`}
                              confirmAction={{
                                buttonText: statusLabel,
                                onClick: () =>
                                  handleChurchStatusToggle(el.churchId, close),
                                loading: isTogglingChurchStatus,
                              }}
                            />
                          )}
                        </Modal>
                      </td>
                      <td>
                        <Popover
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
                                href={`${routes.churchProfile(el.churchId)}`}
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
                                hideCloseButton
                                disableOutsideClick
                              >
                                {(close) => (
                                  <ConfirmActionCard
                                    close={close}
                                    title={`Delete ${el.name}`}
                                    description="Current members will need to update their church. Prefer to disable it instead?"
                                    dangerColor
                                    icon="trash"
                                    confirmAction={{
                                      buttonText: 'Delete',
                                      onClick: () =>
                                        handleDeleteChurch(el.churchId, close),
                                      loading: isDeletingChurch,
                                    }}
                                  />
                                )}
                              </Modal>
                            </li>
                          </ul>
                        </Popover>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChurchAdminHomePage = ({
  user,
  totalBranches,
  branchData,
}: Omit<HomePageProps, 'totalChurches' | 'churchData' | 'teamsData'>) => {
  const [isTogglingChurchStatus, setIsTogglingChurchStatus] = useState(false);
  const [isDeletingChurch, setIsDeletingChurch] = useState(false);

  const handleChurchStatusToggle = async (
    churchId: string,
    close: () => void
  ) => {
    setIsTogglingChurchStatus(true);

    try {
      const result = await toggleChurchStatus(churchId);

      if (result.success) {
        toast.success(result.message);
        close();
      } else {
        toast.error(result.message);
      }
    } finally {
      setIsTogglingChurchStatus(false);
    }
  };

  const handleDeleteChurch = async (churchId: string, close: () => void) => {
    setIsDeletingChurch(true);

    try {
      const result = await deleteChurchAction(churchId);

      if (result.success) {
        toast.success(result.message);
        close();
      } else {
        toast.error(result.message);
      }
    } finally {
      setIsDeletingChurch(false);
    }
  };

  return (
    <div>
      <div className="w-full md:mt-5.75">
        <div className="xsm:flex justify-between items-center">
          <div>
            <h1 className="text-xl font-medium mb-2 md:text-3xl">
              Welcome,
              <span className="capitalize">{` ${user?.user?.firstName} ${user?.user?.lastName}`}</span>
            </h1>
            <p className="text-gray-500 text-xs md:text-base">
              Owner - Gospool
            </p>
          </div>

          <Drawer
            trigger={
              <Button
                type="button"
                className="block capitalize mb-2 mt-2 ml-auto xsm:m-0"
              >
                New branch
              </Button>
            }
            title="Create Church Profile"
            description="Enter details to begin"
            disableEscapeDown
            disableOutsideClick
          >
            {(close) => <CreateChurchForm close={close} />}
          </Drawer>
        </div>

        {/* <div className="max-w-screen mt-4 md:mt-8.75 pb-3 flex items-center overflow-x-auto gap-4 snap-x snap-mandatory">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="flex-1 h-24 rounded-xl snap-start bg-background py-[22.5px] px-3"
            >
              <div className="flex items-center justify-between gap-6.5">
                <div>
                  <p className="text-gray-500 text-sm mb-1 capitalize">
                    {card.name}
                  </p>
                  <p className="font-medium text-xl">{card.count}</p>
                </div>
                <div className="w-11.5 h-11.5 bg-gray-50 rounded-40 flex items-center justify-center">
                  <SvgIcon name={card.iconName} className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div> */}

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
                  <th>Branch owner</th>
                  <th>All</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {branchData?.map((el, index) => {
                  const isActive = el.status === 'active';
                  const statusLabel = isActive ? 'Disable' : 'Enable';
                  console.log('LOGO', el.church.logo);
                  return (
                    <tr key={index}>
                      <td className="capitalize">
                        <div className="flex items-center gap-2">
                          <span className="relative block w-9 h-9 rounded-full aspect-square overflow-hidden ">
                            <Image
                              src={el.church.logo || '/assets/a.png'}
                              alt={el.name}
                              fill
                              sizes="24px"
                            />
                          </span>
                          <span className="inline-block">{el.name}</span>
                        </div>
                      </td>
                      <td className="py-6 px-3 capitalize">{el.leaderName}</td>
                      <td>{totalBranches}</td>
                      <td>
                        <Modal
                          hideCloseButton
                          disableOutsideClick
                          trigger={
                            <button
                              className={`${isActive ? 'bg-green-500 active' : 'bg-gray-100'} toggle-button`}
                            />
                          }
                        >
                          {(close) => (
                            <ConfirmActionCard
                              close={close}
                              title={`${statusLabel} ${el.name}`}
                              icon="toggle"
                              description={`Are you sure you want to ${statusLabel} this church?`}
                              confirmAction={{
                                buttonText: statusLabel,
                                onClick: () =>
                                  handleChurchStatusToggle(el.churchId, close),
                                loading: isTogglingChurchStatus,
                              }}
                            />
                          )}
                        </Modal>
                      </td>
                      <td>
                        <Popover
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
                                href={`${routes.churchProfile(el.churchId)}`}
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
                                hideCloseButton
                                disableOutsideClick
                              >
                                {(close) => (
                                  <ConfirmActionCard
                                    close={close}
                                    title={`Delete ${el.name}`}
                                    description="Current members will need to update their church. Prefer to disable it instead?"
                                    dangerColor
                                    icon="trash"
                                    confirmAction={{
                                      buttonText: 'Delete',
                                      onClick: () =>
                                        handleDeleteChurch(el.churchId, close),
                                      loading: isDeletingChurch,
                                    }}
                                  />
                                )}
                              </Modal>
                            </li>
                          </ul>
                        </Popover>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const BranchLeaderHomePage = ({
  teamsData,
}: Omit<HomePageProps, 'branchData' | 'totalBranches' | 'churchData'>) => {
  const router = useRouter();
  const [isTogglingChurchStatus, setIsTogglingChurchStatus] = useState(false);

  const handleTeamStatusToggle = async (
    churchId: string,
    close: () => void
  ) => {
    setIsTogglingChurchStatus(true);

    try {
      const result = await toggleChurchStatus(churchId);

      if (result.success) {
        toast.success(result.message);
        close();
      } else {
        toast.error(result.message);
      }
    } finally {
      setIsTogglingChurchStatus(false);
    }
  };

  return (
    <div>
      <div className="w-full md:mt-5.75">
        <div className="xsm:flex justify-between items-center">
          <div>
            <h1 className="text-xl font-medium mb-2 md:text-3xl">
              Team members
            </h1>
            <p className="text-gray-500 text-xs md:text-base">
              Admin - Gospool
            </p>
          </div>

          <Drawer
            trigger={
              <Button
                type="button"
                className="block capitalize mb-2 mt-2 ml-auto xsm:m-0"
              >
                Add Team
              </Button>
            }
            title="Create Team"
            description="Enter details to begin"
            disableEscapeDown
            disableOutsideClick
          >
            {(close) => <CreateTeamForm close={close} />}
          </Drawer>
        </div>

        {/* table  */}
        <div className="dashboard-card mt-5">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Date added</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {teamsData?.map((el, index) => {
                  const isActive = el.isActive;
                  const statusLabel = isActive ? 'Disable' : 'Enable';

                  return (
                    <tr
                      key={index}
                      onClick={() =>
                        router.push(routes.teamProfile(el.teamId || ''))
                      }
                      className="cursor-pointer"
                    >
                      <td className="py-6 px-3 capitalize">
                        {dayjs(el.createdAt).format('DD MMM')}
                      </td>
                      <td className="capitalize">
                        <div className="flex items-center gap-2">
                          <span className="relative block w-9 h-9 rounded-full aspect-square overflow-hidden ">
                            <Image
                              src={el.avatar || '/assets/a.png'}
                              alt={el.firstName}
                              fill
                              sizes="24px"
                            />
                          </span>
                          <span className="inline-block">
                            {el.firstName} {el.lastName}
                          </span>
                        </div>
                      </td>
                      <td className="py-6 px-3 capitalize">{el.roles?.[0]}</td>
                      <td>
                        <Modal
                          hideCloseButton
                          disableOutsideClick
                          trigger={
                            <button
                              className={`${isActive ? 'bg-green-500 active' : 'bg-gray-100'} toggle-button`}
                            />
                          }
                        >
                          {(close) => (
                            <ConfirmActionCard
                              close={close}
                              title={`${statusLabel} ${el.firstName} ${el.lastName}`}
                              icon="toggle"
                              description={`Are you sure you want to ${statusLabel} this team member?`}
                              confirmAction={{
                                buttonText: statusLabel,
                                onClick: () =>
                                  handleTeamStatusToggle(el.teamId, close),
                                loading: isTogglingChurchStatus,
                              }}
                            />
                          )}
                        </Modal>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export {
  GospoolAdminHomePage,
  ChurchAdminHomePage,
  BranchLeaderHomePage,
  GospoolAdminHomePage as HomePage,
};
