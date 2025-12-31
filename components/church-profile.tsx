'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/button';
import Input from '@/components/input';
import SvgIcon from '@/components/svg-icon';
import BranchesTable from './branches-table';
import ConfirmActionCard from './confirm-action-card';
import Drawer from './drawer';
import DriversTable from './driver-table';
import CreateChurchBranch from './forms/create-church-branch.form';
import Modal from './modal-component';
import PassengersTable from './passengers-table';
import Popover from './popover';
import Tabs from './tabs';
import TeamMembersTable from './team-members-table';

import { deleteChurchAction } from '@/actions/deleteChurch';
import { compactNumber } from '@/lib/format';
import { routes } from '@/lib/routes';
import profilePic from '@/public/assets/profile-pic.png';
import { type Branch } from '@/types/church.type';
import { type IconName } from '@/types/icon.type';
import { type User } from '@/types/user.type';

type ProfileType = 'passenger' | 'driver' | 'all' | null;
type FormatType = 'csv' | 'pdf' | null;

interface ChurchProfileProps {
  branches: Branch[];
  passengers: User[];
  drivers: User[];
  teamMembers: User[];
  churchLogo?: string;
  adminName: string;
  adminAvatar?: string;
  churchName: string;
  totalBranches: number;
  churchId: string;
  totalTeam: number;
  totalDrivers: number;
  totalPassengers: number;
}

const ChurchProfile = ({
  churchName,
  totalBranches,
  teamMembers,
  adminName,
  branches,
  churchId,
  passengers,
  drivers,
  totalDrivers,
  totalPassengers,
  totalTeam,
  churchLogo,
  adminAvatar,
}: ChurchProfileProps) => {
  const methods = useForm();
  const [profile, setProfile] = useState<ProfileType>(null);
  const [format, setFormat] = useState<FormatType>(null);
  const [isDeletingChurch, setIsDeletingChurch] = useState(false);
  const router = useRouter();

  const cards: { name: string; iconName: IconName; team: number }[] = [
    { name: 'drivers', iconName: 'car', team: totalDrivers },
    { name: 'members', iconName: 'profile-users', team: totalPassengers },
    { name: 'team', iconName: 'profile-users', team: totalTeam },
  ];

  const handleDeleteChurch = async (churchId: string, close: () => void) => {
    setIsDeletingChurch(true);

    try {
      const result = await deleteChurchAction(churchId);

      if (result.success) {
        toast.success(result.message);
        router.push(routes.home());
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
      <div className="dashboard-card  flex flex-col gap-3 xsm:gap-5 md:gap-8.75">
        <div className="flex flex-col gap-2 xsm:flex-row xsm:gap-0 xsm:justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 aspect-square xl:w-16 xl:h-16">
              <Image
                src={churchLogo || '/assets/favicon.png'}
                alt="church logo"
                fill
                sizes="100%"
              />
            </div>
            <div>
              <h1 className="font-semibold md:text-xl">{churchName}</h1>
              <p>
                {totalBranches} branch{totalBranches > 1 && 'es'}
              </p>
            </div>
          </div>

          <div className="xxs:flex items-center gap-4">
            <Drawer
              disableEscapeDown
              disableOutsideClick
              trigger={<Button variant="outline">Add branch</Button>}
              title="Add Church Branch"
              description={
                <>
                  Only <strong>Lagos branches</strong> are supported at this
                  time.
                </>
              }
            >
              {(close) => (
                <div>
                  <CreateChurchBranch close={close} churchId={churchId} />
                </div>
              )}
            </Drawer>
            <Popover
              trigger={
                <Button
                  variant="default"
                  className="flex items-center gap-2 mt-2 xxs:mt-0"
                >
                  Actions
                  <SvgIcon
                    name="arrow-down"
                    className="w-3 h-3 md:w-5 md:h-5"
                  />
                </Button>
              }
            >
              <ul className="table-action-popover [&>li:hover]:bg-primary-100/20 [&>li:focus-within]:ring-2 [&>li:focus-within]:ring-primary-100/20">
                <li>
                  <Modal
                    trigger={
                      <Link href="" className="flex items-center gap-2">
                        <SvgIcon
                          name="download"
                          className="h-4 w-4 text-gray-500"
                        />
                        Download
                      </Link>
                    }
                    // title="Download data"
                    // contentCardClassName="text-left"
                  >
                    {(close) => (
                      <div className="mt-6">
                        <div>
                          <p className="font-medium">Which profile?</p>
                          <div className="flex items-center justify-between gap-3 mt-3 mb-6">
                            <Button
                              onClick={() => setProfile('passenger')}
                              variant={
                                profile === 'passenger' ? 'default' : 'gray'
                              }
                              className="min-w-0 py-3 flex-1 md:px-[42.5px] flex justify-center"
                            >
                              Passenger
                            </Button>
                            <Button
                              onClick={() => setProfile('driver')}
                              variant={
                                profile === 'driver' ? 'default' : 'gray'
                              }
                              className="min-w-0 py-3 flex-1 md:px-[42.5px] flex justify-center"
                            >
                              Driver
                            </Button>
                            <Button
                              onClick={() => setProfile('all')}
                              variant={profile === 'all' ? 'default' : 'gray'}
                              className="min-w-0 py-3 flex-1 md:px-[42.5px] flex justify-center"
                            >
                              All
                            </Button>
                          </div>
                          <p className="font-medium">Download as</p>
                          <div className="w-full mt-3 flex items-center gap-3">
                            <Button
                              onClick={() => setFormat('csv')}
                              variant={format === 'csv' ? 'default' : 'gray'}
                              className="py-[13.5px] md:px-[44.5px] flex items-center gap-2"
                            >
                              <SvgIcon name="csv" className="w-4 h-4" />
                              CSV
                            </Button>

                            <Button
                              onClick={() => setFormat('pdf')}
                              variant={format === 'pdf' ? 'default' : 'gray'}
                              className="py-[13.5px] md:px-[44.5px] flex items-center gap-2"
                            >
                              <SvgIcon name="pdf" className="w-4 h-4" />
                              PDF
                            </Button>
                          </div>
                        </div>
                        <div className="w-full mt-10 flex flex-wrap gap-2 md:gap-3 justify-between">
                          <Button
                            onClick={close}
                            variant="outline"
                            className="block py-[13.5px] xxs:px-[44.5px]"
                          >
                            Cancel
                          </Button>

                          <Modal
                            trigger={
                              <Button
                                variant="default"
                                className="block py-[13.5px] xxs:px-[44.5px]"
                              >
                                Download
                              </Button>
                            }
                            // title="Check your email"
                            // description="We sent the data there!"
                            // imageURL={checkMark}
                            // imageClassName="w-20 h-20"
                          >
                            <Button className="mx-auto px-12.75 py-[13.5px] mt-10">
                              Okay
                            </Button>
                          </Modal>
                        </div>
                      </div>
                    )}
                  </Modal>
                </li>
                <li>
                  <Link href="" className="flex items-center gap-2">
                    <SvgIcon
                      name="generate"
                      className="h-4 w-4 text-gray-500"
                    />
                    Generate
                  </Link>
                </li>
                <li>
                  <Modal
                    trigger={
                      <Link href="" className="flex items-center gap-2">
                        <SvgIcon
                          name="refresh"
                          className="h-4 w-4 text-gray-500"
                        />
                        Reassign
                      </Link>
                    }
                    // title="Reassign branch leader"
                    // contentCardClassName="text-left"
                  >
                    {(close) => (
                      <div className="mt-6">
                        <div className="flex flex-1 items-center gap-3 mb-10">
                          <div className="flex-none relative w-12 h-12">
                            <Image
                              src={profilePic}
                              alt="profile-pic"
                              fill
                              sizes="100%"
                            />
                          </div>

                          <div>
                            <p className="text-gray-800 font-semibold capitalize mb-1">
                              {adminName}
                            </p>
                            <p className="">Current branch leader</p>
                          </div>
                        </div>
                        <FormProvider {...methods}>
                          <form className="flex flex-col gap-5">
                            <Input
                              label="New branch leader full name"
                              name="new-branch-leader-name"
                            />

                            <Input
                              label="Email address"
                              name="branch-leader-email-address"
                            />
                          </form>
                        </FormProvider>
                        <div className="w-full mt-10 flex flex-wrap gap-2 md:gap-3 justify-between">
                          <Button
                            onClick={close}
                            variant="outline"
                            className="py-[13.5px]"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={close}
                            variant="default"
                            className="py-[13.5px] px-7.5"
                          >
                            Send invite
                          </Button>
                        </div>
                      </div>
                    )}
                  </Modal>
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
                        title={`Delete ${churchName}`}
                        description="Current members will need to update their church. Prefer to disable it instead?"
                        dangerColor
                        icon="trash"
                        confirmAction={{
                          buttonText: 'Delete',
                          onClick: () => handleDeleteChurch(churchId, close),
                          loading: isDeletingChurch,
                        }}
                      />
                    )}
                  </Modal>
                </li>
              </ul>
            </Popover>
          </div>
        </div>

        <div className="w-full flex flex-col gap-2 xss:flex-row">
          <div className="flex flex-1 items-center gap-3 ">
            <div className="flex-none relative w-12 h-12">
              <Image
                src={adminAvatar || '/assets/user-icon.png'}
                alt="profile-pic"
                fill
                sizes="100%"
              />
            </div>

            <div>
              <p className="text-gray-800 font-semibold capitalize mb-1">
                {adminName}
              </p>
              <p className="">Church admin</p>
            </div>
          </div>

          {/* bottom-right  */}
          <div className="md:flex flex-1 md:gap-5 max-w-a-150 md:max-w-none">
            {cards.map((el, index) => (
              <div key={index} className="flex items-center gap-2 mb-2 md:mb-0">
                <div className="w-10 h-10 bg-gray-50 rounded-[48px] flex items-center justify-center">
                  <SvgIcon name={el.iconName} className="w-5 h-5" />
                </div>
                <span className="font-semibold text-lg xl:text-2xl max-w-10">
                  {compactNumber(el.team)}
                </span>
                <p className="capitalize text-sm lg;text-base">{el.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-card mt-5">
        <Tabs
          tabs={[
            {
              label: 'Branches',
              content: <BranchesTable branches={branches} />,
            },
            {
              label: 'Passengers',
              content: <PassengersTable passengers={passengers} />,
            },
            {
              label: 'Drivers',
              content: <DriversTable drivers={drivers} />,
            },
            {
              label: 'Team',
              content: <TeamMembersTable teamMembers={teamMembers} />,
            },
          ]}
        ></Tabs>
      </div>
    </div>
  );
};

export default ChurchProfile;
