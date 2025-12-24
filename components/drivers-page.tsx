'use client';
import { Description, Title } from '@radix-ui/react-dialog';
import dayjs from 'dayjs';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import {
  FormProvider,
  useForm,
  Controller,
  SubmitHandler,
} from 'react-hook-form';

import { Button } from './button';
import Modal from './modal-component';
import Popover from './popover';
import StatusTag from './status-tag';
import SvgIcon from './svg-icon';
import ShowView from './show-view';
import NoDataCard from './no-data-card';
import { exportDriversCsv, exportDriversPdf } from './export-drivers';
import Select, { Option } from './select';
import InputFooterText from './input-footer-text';

import { DATE_FORMAT_DMY } from '@/lib/constants';
import { routes } from '@/lib/routes';
import { Driver } from '@/types/driver.type';
import { UserProfile } from '@/types/user.type';
import profilePic from '@/public/assets/profile-pic.png';
import { verifyDriver } from '@/actions/verify-driver';
import { toggleUserStatus } from '@/actions/toggleUserStatus';

interface DriversPageProps {
  user?: UserProfile | null;
  driversData: Driver[];
  totalDrivers?: number;
  initialStatus: string;
  driverReturnTypes: string[];
}

type downloadFormat = 'csv' | 'pdf';

export type FormValues = {
  types: string[];
  reason: string;
};

export const humanize = (s: string) =>
  s
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2') // driversLicense -> drivers License
    .replace(/[_-]/g, ' ') // snake_case or dashed
    .replace(/\b\w/g, (ch) => ch.toUpperCase()); // Capitalize each word

const DriversPageComponent = ({
  driversData,
  initialStatus,
  driverReturnTypes = [],
}: DriversPageProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const form = useForm<FormValues>({
    defaultValues: { types: [], reason: '' },
  });
  const [downloadFormat, setDownloadFormat] = useState<downloadFormat>('csv');
  const [approvingUserId, setApprovingUserId] = useState<string | null>(null);
  const [blockingUserId, setBlockingUserId] = useState<string | null>(null);
  const driverStatus = searchParams.get('status') ?? 'pending';
  const {
    handleSubmit,
    control,
    register,
    setValue,
    reset,
    formState: { isSubmitting, errors },
  } = form;

  const returnTypeOptions: Option[] = driverReturnTypes?.map((t) => ({
    value: t,
    label: humanize(t),
  }));

  const handleFilterChange = (status: string) => {
    const page = searchParams.get('page') ?? '1';
    const limit = searchParams.get('limit') ?? '10';

    router.push(`/drivers?status=${status}&page=${page}&limit=${limit}`);
  };

  const handleReturn = (userId: string, close: () => void) => {
    const onSubmit: SubmitHandler<FormValues> = async (data) => {
      try {
        const res = await verifyDriver({
          userId,
          action: 'return',
          reason: data.reason.trim(),
          types: data.types,
        });

        if (res?.success) {
          toast.success(res.message || 'Return request sent');
          reset();
          close();
          router.refresh();
        } else {
          toast.error('Failed to send return request');
        }
      } catch (err: unknown) {
        console.error(err);
        toast.error('Unexpected error. Try again.');
      }
    };

    return onSubmit;
  };

  const handleApprove = async (userId: string) => {
    try {
      setApprovingUserId(userId);
      const res = await verifyDriver({ userId, action: 'approve' });

      if (res?.success) {
        toast.success(res.message || 'Driver approved');
      } else {
        toast.error('Failed to approve driver');
      }
    } catch (err: unknown) {
      toast.error('Unexpected error. Try again.');
      console.error(err);
    } finally {
      setApprovingUserId(null);
    }
  };

  const handleReject = (userId: string, close: () => void) => {
    const onSubmit: SubmitHandler<FormValues> = async (data) => {
      try {
        const res = await verifyDriver({
          userId,
          action: 'reject',
          reason: data.reason.trim(),
        });

        if (res?.success) {
          toast.success(res.message || 'Driver rejected');
          reset();
          close();
          router.refresh();
        } else {
          toast.error('Failed to reject driver');
        }
      } catch (err: unknown) {
        toast.error('Unexpected error. Try again.');
        console.error(err);
      }
    };

    return onSubmit;
  };

  const handleBlock = async (userId: string, close: () => void) => {
    try {
      setBlockingUserId(userId);
      const res = await toggleUserStatus(userId);

      if (res?.success) {
        toast.success(res.message || 'Driver blocked');
        close();
        router.refresh();
      } else {
        toast.error(res.message || 'Failed to block driver');
      }
    } catch (err: unknown) {
      console.error('Block request failed', err);
      toast.error('Unexpected error. Try again.');
    } finally {
      setBlockingUserId(null);
    }
  };

  const handleDownload = (type: downloadFormat, close: () => void) => {
    if (!driversData || driversData.length === 0) {
      toast.error('No drivers to export');
      return;
    }
    if (type === 'csv') {
      exportDriversCsv(driversData, driverStatus);
    } else if (type === 'pdf') {
      exportDriversPdf(driversData, driverStatus);
    }

    toast.success(`${type.toUpperCase()} download successful`);
    close();
  };

  return (
    <>
      <div className="flex justify-between mb-5">
        <h1 className="dashboard-heading-text">Drivers</h1>

        <Modal
          trigger={<Button>Download</Button>}
          disableOutsideClick
          hideCloseButton
        >
          {(close) => (
            <div className="px-5 py-10 bg-white rounded-20 mx-auto shadow-lg focus:outline-none md:px-10 max-w-110.5">
              <Title className="text-xl font-semibold mb-6 md:text-3xl capitalize">
                Download Data
              </Title>

              <Description className="text-sm text-gray-500 font-normal mb-3">
                Download as
              </Description>

              <div className="flex w-max gap-3 items-center ">
                <Button
                  variant="gray"
                  onClick={() => setDownloadFormat('csv')}
                  className={
                    downloadFormat === 'csv'
                      ? 'bg-green-400 text-background'
                      : ''
                  }
                >
                  <SvgIcon name="csv" className="w-5 h-5 text-black" />
                  CSV
                </Button>
                <Button
                  variant="gray"
                  onClick={() => setDownloadFormat('pdf')}
                  className={
                    downloadFormat === 'pdf'
                      ? 'bg-green-400 text-background '
                      : ''
                  }
                >
                  <SvgIcon name="pdf" className="w-5 h-5 text-black" />
                  PDF
                </Button>
              </div>

              <div className="flex w-full justify-between mt-10 gap-5">
                <Button variant="outline" onClick={close}>
                  Cancel
                </Button>

                <Button
                  onClick={() => {
                    handleDownload(downloadFormat, close);
                    close();
                  }}
                >
                  Download
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>

      <div className="dashboard-card">
        <div className="flex flex-wrap justify-between items-center mb-5 gap-3">
          <div className="flex gap-2 ">
            <Button
              variant={initialStatus === 'pending' ? 'default' : 'outline'}
              onClick={() => handleFilterChange('pending')}
            >
              Pending
            </Button>
            <Button
              variant={initialStatus === 'approved' ? 'default' : 'outline'}
              onClick={() => handleFilterChange('approved')}
            >
              Approved
            </Button>
          </div>
          <div className="flex justify-between gap-4">
            <div className="flex flex-1 gap-2 items-center px-3 bg-gray-50 rounded-xl w-35  max-w-a-300">
              <SvgIcon name="search" className="w-5 h-5 text-gray-500" />
              <input type="search" name="" id="" className="flex-1 py-2" />
            </div>
            <div className="flex gap-2 justify-between items-center px-3  bg-gray-50 rounded-xl w-full max-w-32">
              All
              <SvgIcon name="arrow-down" className="w-4 h-4 text-gray-500" />
            </div>
          </div>
        </div>

        <ShowView when={!!driversData?.length}>
          <div className="overflow-x-auto rounded-t-xl ">
            <table className="w-full text-left text-a-14">
              <thead className="rounded-xl overflow-hidden">
                <tr className="bg-gray-50  [&>th]:px-4 [&>th]:py-3 [&>th]:font-medium text-base-black">
                  <th>
                    {driverStatus === 'pending'
                      ? 'Date requested'
                      : 'Date joined'}
                  </th>
                  <th>Name</th>
                  <th>Church</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {driversData?.map((el, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      {driverStatus === 'pending'
                        ? dayjs(el.driverRequestedAt).format(DATE_FORMAT_DMY)
                        : dayjs(el.driverVerifiedAt).format(DATE_FORMAT_DMY)}
                    </td>
                    <td className="px-4 py-3">
                      {el.firstName + ' ' + el.lastName}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative flex-none w-10 h-10 rounded-full overflow-hidden">
                          <Image
                            src={profilePic} //dynamic -- to be updated later
                            alt={
                              el?.churchName
                                ? `${el?.churchName} avatar`
                                : 'avatar'
                            }
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate capitalize">
                            {el?.churchName || '--'}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {el?.branchName || '—-'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{el?.churchName}</td>

                    <td className="px-4 py-3">
                      <StatusTag
                        warning={el.driverVerificationStatus == 'pending'}
                        danger={el.driverVerificationStatus == 'rejected'}
                        text={el.statusDisplay}
                      />
                    </td>
                    <td className="px-4 py-3 text-gray-500 ">
                      <Popover
                        trigger={
                          <button className="m-auto block w-max">
                            <SvgIcon name="dotted-menu" className="w-7 h-5" />
                          </button>
                        }
                      >
                        <div className="option-menu">
                          {el.driverVerificationStatus === 'pending' ? (
                            <>
                              <Link href={`${routes.driverProfile(el.userId)}`}>
                                <SvgIcon name="eye" />
                                <p>View</p>
                              </Link>
                              <button
                                onClick={() => handleApprove(el.userId)}
                                disabled={approvingUserId === el.userId}
                                className={
                                  approvingUserId === el.userId
                                    ? 'opacity-60 cursor-not-allowed'
                                    : ''
                                }
                              >
                                <SvgIcon name="check" />
                                <p>
                                  {approvingUserId === el.userId
                                    ? 'Approving...'
                                    : 'Approve'}
                                </p>
                              </button>
                              <Modal
                                trigger={
                                  <button>
                                    <SvgIcon name="refresh" />
                                    <p>Return</p>
                                  </button>
                                }
                                hideCloseButton
                              >
                                {(close) => (
                                  <FormProvider {...form}>
                                    <form
                                      className="bg-background rounded-20 p-10 max-w-110.5 mx-auto"
                                      onSubmit={handleSubmit(
                                        handleReturn(el.userId, close)
                                      )}
                                    >
                                      <Title className="text-3xl font-semibold mb-2">
                                        Return Requests
                                      </Title>
                                      <Description className="text-gray-400">
                                        Please share what the driver needs to
                                        correct
                                      </Description>

                                      <p className="mt-6 mb-2">Type</p>

                                      <div>
                                        <Controller
                                          control={control}
                                          name="types"
                                          render={({ field }) => (
                                            <Select
                                              options={returnTypeOptions}
                                              value={field.value}
                                              onChange={(v) => {
                                                const types = Array.isArray(v)
                                                  ? v
                                                  : [];
                                                field.onChange(types);
                                              }}
                                              placeholder="Select"
                                              multiple
                                            />
                                          )}
                                        />

                                        {errors.types &&
                                          errors.types.message && (
                                            <div>
                                              <InputFooterText
                                                text={errors.types.message}
                                                isError
                                              />
                                            </div>
                                          )}
                                      </div>

                                      <div>
                                        <textarea
                                          {...register('reason', {
                                            required:
                                              'Please provide a return request',
                                          })}
                                          onChange={(e) => {
                                            setValue('reason', e.target.value);
                                          }}
                                          className="mt-2 p-4 bg-gray-50 w-full rounded-8 h-40"
                                          placeholder="Describe the request"
                                        />
                                        {errors.reason &&
                                          errors.reason.message && (
                                            <div>
                                              <InputFooterText
                                                text={errors.reason.message}
                                                isError
                                              />
                                            </div>
                                          )}
                                      </div>

                                      <div className="flex xmd:w-max gap-5 items-center ml-auto mt-10 flex-wrap">
                                        <Button
                                          variant="gray"
                                          className="xmd:px-8 xmd:py-3"
                                          onClick={() => {
                                            reset();
                                            close();
                                          }}
                                        >
                                          Cancel
                                        </Button>

                                        <Button
                                          variant="default"
                                          className="xmd:px-8 xmd:py-3"
                                          disabled={isSubmitting}
                                        >
                                          {isSubmitting
                                            ? 'Sending...'
                                            : 'Send message'}
                                        </Button>
                                      </div>
                                    </form>
                                  </FormProvider>
                                )}
                              </Modal>

                              <Modal
                                trigger={
                                  <button className="text-error-700">
                                    <SvgIcon name="flag" />
                                    <p>Reject</p>
                                  </button>
                                }
                                hideCloseButton
                              >
                                {(close) => (
                                  <FormProvider {...form}>
                                    <form
                                      className="bg-background rounded-20 p-10 text-center max-w-a-500 mx-auto"
                                      onSubmit={handleSubmit(
                                        handleReject(el.userId, close)
                                      )}
                                    >
                                      <button
                                        onClick={close}
                                        aria-label="Close dialog"
                                        className="mb-4 mx-auto block bg-transparent border-0"
                                        type="button"
                                      >
                                        <Image
                                          src="/assets/close-circle.png"
                                          alt="close-circle"
                                          width={60}
                                          height={60}
                                          priority
                                        />
                                      </button>

                                      <Title className="text-3xl font-semibold mb-2">
                                        Reject {el.firstName} {el.lastName}
                                      </Title>
                                      <Description className="text-gray-400">
                                        {el.firstName} will receive the reason
                                        for rejection
                                      </Description>

                                      <div>
                                        <textarea
                                          className="mt-6 p-4 bg-gray-50 w-full rounded-8 h-40"
                                          {...register('reason', {
                                            required: 'Please provide a reason',
                                            minLength: {
                                              value: 10,
                                              message:
                                                'Reason must be at least 10 characters',
                                            },
                                          })}
                                          onChange={(e) =>
                                            setValue('reason', e.target.value)
                                          }
                                          placeholder="Give a reason..."
                                        />

                                        {errors.reason &&
                                          errors.reason.message && (
                                            <div>
                                              <InputFooterText
                                                text={errors.reason.message}
                                                isError
                                              />
                                            </div>
                                          )}
                                      </div>
                                      <div className="flex xmd:w-max flex-wrap gap-5 items-center ml-auto mt-10">
                                        <Button
                                          variant="gray"
                                          className="xmd:px-8 xmd:py-3"
                                          onClick={() => {
                                            reset();
                                            close();
                                          }}
                                        >
                                          Cancel
                                        </Button>

                                        <Button
                                          variant="danger"
                                          className="xmd:px-8 xmd:py-3"
                                          disabled={isSubmitting}
                                        >
                                          {isSubmitting
                                            ? 'Rejecting...'
                                            : 'Yes reject'}
                                        </Button>
                                      </div>
                                    </form>
                                  </FormProvider>
                                )}
                              </Modal>
                            </>
                          ) : (
                            <>
                              <Link href={`${routes.driverProfile(el.userId)}`}>
                                <SvgIcon name="eye" />
                                <p>View</p>
                              </Link>
                              <button>
                                <SvgIcon name="message-text" />
                                <p>Message</p>
                              </button>

                              <Modal
                                trigger={
                                  <button>
                                    <SvgIcon
                                      name="user-minus"
                                      className="text-error-700"
                                    />
                                    <p className="text-error-700">
                                      {el.isActive ? 'Block' : 'Unblock'}
                                    </p>
                                  </button>
                                }
                                hideCloseButton
                              >
                                {(close) => {
                                  const confirmLabel = el.isActive
                                    ? 'Block'
                                    : 'Unblock';
                                  const inProgressLabel = el.isActive
                                    ? 'Blocking...'
                                    : 'Unblocking...';
                                  return (
                                    <div className="bg-background rounded-20 p-10 text-center max-w-a-500 mx-auto">
                                      <button
                                        onClick={close}
                                        aria-label="Close dialog"
                                        className="mb-4 mx-auto block bg-transparent border-0"
                                        type="button"
                                      >
                                        <Image
                                          src="/assets/user-remove.png"
                                          alt="block-user-icon"
                                          width={60}
                                          height={60}
                                          priority
                                        />
                                      </button>

                                      <Title className="text-3xl font-semibold mb-2">
                                        {el.isActive
                                          ? 'Block Driver'
                                          : 'Unblock Driver'}
                                      </Title>
                                      <Description className="text-gray-400">
                                        What action would you like to take?
                                      </Description>

                                      <div className="flex justify-between gap-2 xsm:gap-5 xxs:w-max items-center flex-wrap mx-auto mt-10">
                                        <Button
                                          variant="gray"
                                          className="xsm:px-8 xsm:py-3"
                                          onClick={close}
                                        >
                                          Cancel
                                        </Button>

                                        <Button
                                          variant={
                                            el.isActive ? 'danger' : 'default'
                                          }
                                          className="xsm:px-8 xsm:py-3"
                                          onClick={() =>
                                            handleBlock(el.userId, close)
                                          }
                                          disabled={
                                            blockingUserId === el.userId
                                          }
                                        >
                                          {blockingUserId === el.userId
                                            ? inProgressLabel
                                            : confirmLabel}
                                        </Button>
                                      </div>
                                    </div>
                                  );
                                }}
                              </Modal>
                            </>
                          )}
                        </div>
                      </Popover>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ShowView>

        <ShowView when={!driversData?.length}>
          <NoDataCard heading="No Driver yet" description={''} />
        </ShowView>
      </div>
    </>
  );
};

export default DriversPageComponent;
