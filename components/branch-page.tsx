'use client';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/button';
import SvgIcon from '@/components/svg-icon';
import CreateChurchDepartmentModal from './create-church-department-modal';
import CreateChurchServiceModal from './create-church-service-modal';
import DriversTable from './driver-table';
import PassengersTable from './passengers-table';
import Popover from './popover';
import Tabs from './tabs';
import TeamMembersTable from './team-members-table';

import { compactNumber } from '@/lib/format';
import profilePic from '@/public/assets/profile-pic.png';
import { type IconName } from '@/types/icon.type';
import { type User } from '@/types/user.type';
import { ChurchService } from '@/types/services.type';
import ChurchServicesTable from './services-table';

interface BranchPageProps {
  passengers: User[];
  drivers: User[];
  services: ChurchService[];
  teamMembers: User[];
  churchName: string;
  churchAddress: string;
  churchLogo?: string;
  churchAdmin: string;
  totalTeam: number;
  totalDrivers: number;
  totalPassengers: number;
  branchId: string;
}

function BranchPage({
  passengers,
  teamMembers,
  drivers,
  services,
  churchName,
  churchAddress,
  churchAdmin,
  churchLogo = '/assets/default-church-logo.png',
  totalDrivers,
  totalPassengers,
  totalTeam,
  branchId,
}: BranchPageProps) {
  const cards: { name: string; iconName: IconName; team: number }[] = [
    { name: 'drivers', iconName: 'car', team: totalDrivers },
    { name: 'members', iconName: 'profile-users', team: totalPassengers },
    { name: 'team', iconName: 'profile-users', team: totalTeam },
  ];

  return (
    <div>
      <div className="dashboard-card  flex flex-col gap-3 xsm:gap-5 md:gap-8.75">
        <div className="flex flex-col gap-2 xsm:flex-row xsm:gap-0 xsm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-12 h-12 xl:w-16 xl:h-16">
              <Image
                src={churchLogo ?? ''}
                alt="church logo"
                fill
                sizes="100%"
              />
            </div>
            <div>
              <h1 className="font-semibold md:text-xl">{churchName}</h1>
              <p className="max-w-55 text-xs xl:text-base md:max-w-none">
                {churchAddress}
              </p>
            </div>
          </div>

          <div className="ml-auto max-w-35">
            <Popover
              trigger={
                <Button className="flex items-center gap-2 mt-2 xxs:mt-0">
                  Actions
                  <SvgIcon
                    name="arrow-down"
                    className="w-3 h-3 md:w-5 md:h-5"
                  />
                </Button>
              }
            >
              <ul className="option-menu">
                <CreateChurchDepartmentModal
                  trigger={
                    <li>
                      {' '}
                      <SvgIcon name="plus" className="h-4 w-4 text-gray-500" />
                      Create Department
                    </li>
                  }
                  branchId={branchId}
                />
                <CreateChurchServiceModal
                  trigger={
                    <li>
                      {' '}
                      <SvgIcon name="plus" className="h-4 w-4 text-gray-500" />
                      Create Service
                    </li>
                  }
                  branchId={branchId}
                />
                <li>
                  <Link href="" className="flex items-center gap-2">
                    <SvgIcon
                      name="download"
                      className="h-4 w-4 text-gray-500"
                    />
                    Download
                  </Link>
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
                  <Link href="" className="flex items-center gap-2">
                    <SvgIcon name="refresh" className="h-4 w-4 text-gray-500" />
                    Reassign
                  </Link>
                </li>
              </ul>
            </Popover>
          </div>
        </div>

        <div className="w-full flex flex-col gap-2 xss:flex-row">
          <div className="flex flex-1 items-center gap-3 ">
            <div className="flex-none relative w-12 h-12">
              <Image src={profilePic} alt="profile-pic" fill sizes="100%" />
            </div>

            <div>
              <p className="text-gray-800 font-semibold capitalize mb-1">
                {churchAdmin}
              </p>
              <p className="text-xs xl:text-base">Current branch leader</p>
            </div>
          </div>

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

      {/* <div className="dashboard-card mt-5">
        <div className="md:flex items-center justify-between">
          <div className="flex justify-between gap-4 mb-4 md:order-2 w-full">
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
        </div>

      </div> */}

      <div className="dashboard-card mt-5">
        <Tabs
          tabs={[
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
            {
              label: 'Services',
              content: (
                <ChurchServicesTable services={services} branchId={branchId} />
              ),
            },
          ]}
        ></Tabs>
      </div>
    </div>
  );
}

export default BranchPage;
