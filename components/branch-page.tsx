'use client';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/button';
import SvgIcon from '@/components/svg-icon';

import { compactNumber } from '@/lib/format';
import { routes } from '@/lib/routes';
import profilePic from '@/public/assets/profile-pic.png';
import { Branch } from '@/types/church.type';
import { IconName } from '@/types/icon.type';
import HoverCard from './hover-card';

interface BranchPageProps {
  branches: Branch[];
  churchName: string;
  churchAddress: string;
  churchLogo?: string;
  churchAdmin: string;
}

const cards = [
  { name: 'drivers', iconName: 'car' as IconName, team: 100 },
  { name: 'members', iconName: 'profile-users' as IconName, team: 1000 },
  { name: 'team', iconName: 'profile-users' as IconName, team: 100 },
];

function BranchPage({
  branches,
  churchName,
  churchAddress,
  churchAdmin,
  churchLogo = '/assets/default-church-logo.png',
}: BranchPageProps) {
  const display = 'team';

  return (
    <div>
      <div className="rounded-20 p-5 flex flex-col gap-3 xsm:gap-5 md:gap-[35px]">
        <div className="flex flex-col gap-2 xsm:flex-row xsm:gap-0 xsm:justify-between">
          {/* top-left  */}
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
              <h1 className="font-semibold text-xl md:text-3xl mb-1">
                {churchName}
              </h1>
              <p className="max-w-55 text-xs xl:text-base md:max-w-none">
                {churchAddress}
              </p>
            </div>
          </div>

          <div className="ml-auto max-w-[140px]">
            <HoverCard
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
                <li className="text-error-700">
                  <Link href="" className="flex items-center gap-2">
                    <SvgIcon name="trash" className="h-4 w-4" />
                    Delete
                  </Link>
                </li>
              </ul>
            </HoverCard>
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

          <div className="md:flex flex-1 md:gap-5 max-w-[150px] md:max-w-none">
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
        <div className="md:flex items-center justify-between">
          <div className="flex justify-between gap-4 mb-4 md:order-2">
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

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>{display === 'team' ? 'date added' : 'date joined'}</th>
                <th>name</th>
                <th>{display === 'team' ? 'role' : 'department'}</th>
                <th>actions</th>
              </tr>
            </thead>

            <tbody>
              {branches?.map((el, index) => (
                <tr key={index}>
                  <td>{el.formattedDate}</td>
                  <td className="py-6 px-3 capitalize">{el.name}</td>
                  <td>
                    {display === 'team' ? (
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative flex-none w-10 h-10 rounded-full overflow-hidden">
                          <Image
                            src={profilePic}
                            alt={el.name ? `${el.name} avatar` : 'avatar'}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate capitalize">{el.name}</p>
                          <p className="text-sm text-gray-500 truncate">
                            {el.leaderEmail ?? '—'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <span className="capitalize truncate block">
                        {el.name}
                      </span>
                    )}
                  </td>
                  <td>
                    <HoverCard
                      trigger={
                        <button className="block w-max">
                          <SvgIcon name="dotted-menu" className="w-7 h-5" />
                        </button>
                      }
                    >
                      <ul className="table-action-popover">
                        <li>
                          <Link
                            href={`${routes.branchPage(index.toString(), index.toString())}`}
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
                          <Link href="" className="flex items-center gap-2">
                            <SvgIcon name="trash" className="h-4 w-4" />
                            Delete
                          </Link>
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
  );
}

export default BranchPage;
