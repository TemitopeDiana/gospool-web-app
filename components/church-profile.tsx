'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Button } from '@/components/button';
import Input from '@/components/input';
import Modal from '@/components/modal';
import SvgIcon from '@/components/svg-icon';
import Drawer from './drawer';
import CreateChurchBranch from './forms/create-church-branch.form';
import NoDataCard from './no-data-card';
import ShowView from './show-view';
import Tabs from './tabs';

import { compactNumber } from '@/lib/format';
import { routes } from '@/lib/routes';
import checkMark from '@/public/assets/check.png';
import churchLogo from '@/public/assets/default-church-logo.png';
import profilePic from '@/public/assets/profile-pic.png';
import { Branch } from '@/types/church.type';
import { IconName } from '@/types/icon.type';
import HoverCard from './hover-card';

type ProfileType = 'passenger' | 'driver' | 'all' | null;
type FormatType = 'csv' | 'pdf' | null;

const cards: { name: string; iconName: IconName; team: number }[] = [
  { name: 'drivers', iconName: 'car', team: 100 },
  { name: 'members', iconName: 'profile-users', team: 1000 },
  { name: 'team', iconName: 'profile-users', team: 100 },
];

interface ChurchProfileProps {
  branches: Branch[];
  churchLogo?: string;
  adminName: string;
  churchName: string;
  totalBranches: number;
  churchId: string;
}

function ChurchProfile({
  churchName,
  totalBranches,
  adminName,
  branches,
  churchId,
}: ChurchProfileProps) {
  const methods = useForm();
  const [profile, setProfile] = useState<ProfileType>(null);
  const [format, setFormat] = useState<FormatType>(null);

  return (
    <div>
      <div className="dashboard-card  flex flex-col gap-3 xsm:gap-5 md:gap-[35px]">
        <div className="flex flex-col gap-2 xsm:flex-row xsm:gap-0 xsm:justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 aspect-square xl:w-16 xl:h-16">
              <Image src={churchLogo} alt="church logo" fill sizes="100%" />
            </div>
            <div>
              <h1 className="font-semibold md:text-xl">{churchName}</h1>
              <p>{totalBranches} branches</p>
            </div>
          </div>

          <div className="xxs:flex items-center gap-4">
            <Drawer
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
                    title="Download data"
                    contentCardClassName="text-left"
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
                            title="Check your email"
                            description="We sent the data there!"
                            imageURL={checkMark}
                            imageClassName="w-20 h-20"
                          >
                            <Button className="mx-auto px-[51px] py-[13.5px] mt-10">
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
                    title="Reassign branch leader"
                    contentCardClassName="text-left"
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
                            className="py-[13.5px] px-[30px]"
                          >
                            Send invite
                          </Button>
                        </div>
                      </div>
                    )}
                  </Modal>
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
                {adminName}
              </p>
              <p className="">Church admin</p>
            </div>
          </div>

          {/* bottom-right  */}
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

        <Tabs
          tabs={[
            {
              label: 'Branches',
              content: (
                <>
                  <ShowView when={!!branches.length}>
                    <div className="table-wrapper">
                      <table>
                        <thead>
                          <tr>
                            <th>Date Created</th>
                            <th>Name</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>

                        <tbody>
                          {branches.map((el, index) => (
                            <tr key={index}>
                              <td>{el.formattedDate}</td>
                              <td className="py-6 px-3 capitalize">
                                {el.name}
                              </td>
                              <td>
                                <button
                                  className={`${el.status === 'active' ? 'bg-green-500 active' : 'bg-gray-100'} toggle-button`}
                                ></button>
                              </td>
                              <td>
                                <HoverCard
                                  trigger={
                                    <button className="block w-max">
                                      <SvgIcon
                                        name="dotted-menu"
                                        className="w-7 h-5"
                                      />
                                    </button>
                                  }
                                >
                                  <ul className="table-action-popover">
                                    <li>
                                      <Link
                                        href={`${routes.branchPage(churchId, el.branchId)}`}
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
                                      <Link
                                        href=""
                                        className="flex items-center gap-2"
                                      >
                                        <SvgIcon
                                          name="trash"
                                          className="h-4 w-4"
                                        />
                                        Delete
                                      </Link>
                                    </li>
                                    R
                                  </ul>
                                </HoverCard>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </ShowView>

                  <ShowView when={!branches.length}>
                    <NoDataCard
                      heading="No Branch yet"
                      description="Church is not live yet"
                    />
                  </ShowView>
                </>
              ),
            },
            {
              label: 'Passengers',
              content: <>Passengers</>,
            },
            {
              label: 'Drivers',
              content: <>Drivers</>,
            },
            {
              label: 'Team',
              content: <>Drivers</>,
            },
          ]}
        ></Tabs>
      </div>
    </div>
  );
}

export default ChurchProfile;
