'use client';
import Image from 'next/image';
import { FormProvider, useForm } from 'react-hook-form';
import { useState } from 'react';

import Input from '@/components/input';
import SvgIcon from '@/components/svg-icon';
import { Button } from '@/components/button';
import Drawer from '@/components/drawer';

import churchLogo from '@/public/assets/default-church-logo.png';
import ShowView from '@/components/show-view';
import Modal from '@/components/modal';
import checkMark from '@/public/assets/check.png';
import frame from '@/public/assets/Frame.png';

const branches = [
  {
    name: 'CCI Ikeja',
    location:
      'Balmoral Convention Center, 30 Mobolaji Bank Anthony Way, Maryland, Ikeja 101233 Lagos',
  },
  {
    name: 'CCI Lekki',
    location:
      'Balmoral Convention Center, 30 Mobolaji Bank Anthony Way, Maryland, Ikeja 101233 Lagos',
  },

  {
    name: 'CCI Yaba',
    location:
      'Balmoral Convention Center, 30 Mobolaji Bank Anthony Way, Maryland, Ikeja 101233 Lagos',
  },
];

const maxChars = 30;
const loc =
  'Balmoral Convention Center, 30 Mobolaji Bank Anthony Way, Maryland, Ikeja 101233 Lagos';

function AddBranch() {
  const methods = useForm();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [expand, setExpand] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const shouldTruncate = loc.length > maxChars;

  return (
    <div>
      <div className="max-w-[676px] mx-auto mt-10 py-6 md:py-10 md:px-8 px-3 rounded-20 bg-background p-10">
        <div className="xsm:flex items-end justify-between gap-4">
          <div>
            <h1 className="text-text-200 font-semibold text-2xl md:text-3xl mb-2">
              Add branch
            </h1>
            <p>
              Only <span className="font-semibold">Lagos branches </span>
              are supported at this time.
            </p>
          </div>

          <div className="view-branches-menu">
            <Drawer
              trigger={
                <button className="p-2 bg-gray rounded-40 flex gap-1 h-10 w-[124px] md:w-[132px] ml-auto mt-4 xsm:mt-0 items-center">
                  <Image
                    src={churchLogo}
                    alt="church logo"
                    width={24}
                    height={24}
                    className=""
                    priority
                  />
                  <p className="flex">
                    <span className="font-semibold mr-1">10</span> branch
                  </p>

                  <div className="h-5 w-5">
                    <SvgIcon
                      name="arrow-right"
                      className="text-color-text-200 w-full h-full [&>use]:h-5 [&>use]:w-5"
                    />
                  </div>
                </button>
              }
              title="All Branches"
              description={''}
            >
              <ShowView
                when={!showEditForm}
                fallback={
                  <div>
                    <div className="mb-6 flex items-center gap-3">
                      <div className="relative flex-shrink-0 w-6 h-6 md:w-[48px] md:h-[48px]">
                        <Image
                          src={churchLogo}
                          alt="church logo"
                          fill
                          sizes="100"
                          priority
                        />
                      </div>

                      <div>
                        <p className="font-medium">CCI Ikeja</p>
                        <p className="text-sm text-gray-500">
                          <span className="hidden md:inline">
                            {' '}
                            Balmoral Convention Center, 30 Mobolaji Bank Anthony
                            Way, Maryland, Ikeja 101233 Lagos
                          </span>

                          <span className="inline md:hidden">
                            {expand ? loc : loc.slice(0, maxChars)}
                            {shouldTruncate && (
                              <button
                                onClick={() => setExpand((prev) => !prev)}
                                className={`ml-1 align-baseline ${expand ? 'underline' : ''}`}
                                aria-expanded={expand}
                              >
                                {expand ? 'less' : '...'}
                              </button>
                            )}
                          </span>
                        </p>
                      </div>
                    </div>

                    <FormProvider {...methods}>
                      <form className="mt-10 flex flex-col gap-4">
                        <Input label="Branch name" name="branch-name" />

                        <Input label="Branch address" name="branch-address" />

                        <Input
                          label="Branch leader full name"
                          name="branch-leader-name"
                        />

                        <Input
                          label="Branch leader email address"
                          name="branch-leader-email"
                        />

                        <div className="flex items-center justify-end gap-3">
                          <Button
                            variant="outline"
                            className="px-8 xsm:px-10 py-[13.5px] w-fit"
                          >
                            Cancel
                          </Button>

                          <Button
                            variant="default"
                            className="capitalize px-[26px] xsm:px-10 py-[13.5px] w-fit"
                          >
                            Update
                          </Button>
                        </div>
                      </form>
                    </FormProvider>
                  </div>
                }
              >
                <div>
                  {branches.map((branch, index) => {
                    const loc = branch.location ?? '';
                    const isExpanded = expandedIndex === index;
                    const shouldTruncate = loc.length > maxChars;

                    return (
                      <div
                        key={index}
                        className="mb-10 flex items-center gap-3"
                      >
                        <div className="relative flex-shrink-0 w-6 h-6 md:w-[48px] md:h-[48px]">
                          <Image
                            src={churchLogo}
                            alt="church logo"
                            fill
                            sizes="100"
                            priority
                          />
                        </div>

                        <div>
                          <p className="font-medium">{branch.name}</p>
                          <p className="text-sm text-gray-500">
                            <span className="hidden md:inline">{loc}</span>

                            <span
                              className="inline md:hidden"
                              id={`branch-${index}-loc`}
                            >
                              {isExpanded ? loc : loc.slice(0, maxChars)}
                              {shouldTruncate && (
                                <button
                                  onClick={() =>
                                    setExpandedIndex(isExpanded ? null : index)
                                  }
                                  className={`ml-1 align-baseline ${isExpanded ? 'underline' : ''}`}
                                  aria-expanded={isExpanded}
                                  aria-controls={`branch-${index}-loc`}
                                >
                                  {isExpanded ? 'less' : '...'}
                                </button>
                              )}
                            </span>
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Modal
                            trigger={
                              <button className="relative text-error-700 w-6 h-6 md:w-10 md:h-10 flex items-center justify-center rounded-40 bg-error-25">
                                <SvgIcon
                                  name="trash"
                                  className="w-5 h-5 cursor-pointer"
                                />
                              </button>
                            }
                            title="Delete CCI Ikeja?"
                            description="Sure about this? You’ll need to re-enter all details if you change your mind."
                            iconName="trash"
                            iconSizeClassName="w-8 h-8 text-error-700"
                            maxWidthClassName="max-w-[442px]"
                            iconContainerClassName="w-18 h-18 rounded-40 bg-error-50 flex items-center justify-center"
                            onClose={() => console.log('closed')}
                          >
                            {(close) => (
                              <div className="mt-10 flex gap-5 justify-center">
                                <Button
                                  onClick={close}
                                  variant="outline"
                                  className="py-[13.5px] px-7 md:px-[47px]"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="danger"
                                  className="py-[13.5px] px-7 md:px-[47px]"
                                >
                                  Delete
                                </Button>
                              </div>
                            )}
                          </Modal>

                          <button
                            className="relative text-gray-800 w-6 h-6 md:w-10 md:h-10 flex items-center justify-center bg-gray-50 rounded-40"
                            onClick={() => setShowEditForm(true)}
                          >
                            <SvgIcon
                              name="edit"
                              className="w-5 h-5 cursor-pointer"
                            />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ShowView>
            </Drawer>
          </div>
        </div>

        <FormProvider {...methods}>
          <form className="mt-10 flex flex-col gap-4">
            <Input label="Branch name" name="branch-name" />

            <Input label="Branch address" name="branch-address" />

            <Input label="Branch leader full name" name="branch-leader-name" />

            <Input
              label="Branch leader email address"
              name="branch-leader-email"
            />

            <Button
              variant="default"
              className="place-self-end xsm:px-[39.5px] py-[13.5px]"
            >
              Save Branch
            </Button>
          </form>
        </FormProvider>

        <div className="mt-10 flex flex-col xxs:flex-row justify-between xxs:items-center gap-2">
          <Button
            variant="outline"
            className="px-8 xsm:px-[52px] py-[13.5px] w-fit"
          >
            Back
          </Button>

          <Modal
            trigger={
              <Button
                variant="outline"
                className="capitalize px-[26px] xsm:px-[43px] py-[13.5px] w-fit"
              >
                Send invite
              </Button>
            }
            title="Invite branch leaders"
            description="3 branch leaders will be invited. Each can manage and Gospool required departments."
            imageURL={frame}
            imageClassName="w-20 h-20"
            maxWidthClassName="max-w-[442px]"
            onClose={() => console.log('closed')}
          >
            {(close) => (
              <div className="mt-10 flex gap-5 justify-center">
                <Button
                  onClick={close}
                  variant="outline"
                  className="py-[13.5px] px-7 md:px-[47px]"
                >
                  Cancel
                </Button>

                <Modal
                  trigger={
                    <Button
                      variant="default"
                      className="py-[13.5px] px-7 md:px-[47px]"
                    >
                      Yes, invite
                    </Button>
                  }
                  title="Invites Sent"
                  description="They should get their onboarding details in their mail now"
                  imageURL={checkMark}
                  imageClassName="w-20 h-[85px]"
                  maxWidthClassName="max-w-[442px]"
                  onClose={() => console.log('closed')}
                >
                  {(close) => (
                    <Button
                      onClick={close}
                      variant="default"
                      className="py-[13.5px] px-[47px] mt-10 mx-auto"
                    >
                      Okay
                    </Button>
                  )}
                </Modal>
              </div>
            )}
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default AddBranch;
