'use client';

import dayjs from 'dayjs';
import Image from 'next/image';
import { useState } from 'react';
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/button';
import Modal from '@/components/modal-component';
import Popover from '@/components/popover';
import SvgIcon from '@/components/svg-icon';
import Tabs from '@/components/tabs';
import { DATE_FORMAT_DMY } from '@/lib/constants';
import { calculateAge } from '@/utils/calculate-age';
import { Description, Title } from '@radix-ui/react-dialog';
import { Driver } from '@/types/driver.type';
import { verifyDriver } from '@/actions/verify-driver';

import DocumentLink from './document-link';
import ShowView from './show-view';
import { FormValues, humanize } from './drivers-page';
import InputFooterText from './input-footer-text';
import Select, { Option } from './select';
import { routes } from '@/lib/routes';

interface IReviewDriverApplication {
  driver: Driver;
  driverReturnTypes: string[];
}

const ReviewDriverApplication = ({
  driver,
  driverReturnTypes,
}: IReviewDriverApplication) => {
  const [approvingUserId, setApprovingUserId] = useState<string | null>(null);
  const vehicles = driver?.vehicles ?? [];

  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(
    vehicles.length > 0 ? vehicles[0].vehicleId : null
  );
  const router = useRouter();
  const selectedVehicle =
    (driver?.vehicles &&
      driver?.vehicles.find((v) => v.vehicleId === selectedVehicleId)) ??
    null;
  const form = useForm<FormValues>({
    defaultValues: { types: [], reason: '' },
  });
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
          router.replace(routes.drivers());
          reset();
          close();
        } else {
          toast.error('Failed to send return request');
        }
      } catch (err: unknown) {
        console.error('Return request failed', err);
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
      console.error('Approve request failed', err);
      toast.error('Unexpected error. Try again.');
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
          router.replace(routes.drivers());
          reset();
          close();
        } else {
          toast.error('Failed to reject driver');
        }
      } catch (err: unknown) {
        console.error('Reject request failed', err);
        toast.error('Unexpected error. Try again.');
      }
    };

    return onSubmit;
  };

  return (
    <div className="w-full !max-w-[676px]">
      <h1 className="dashboard-heading-text">Review Application</h1>
      <p>Please go over driver’s application thoroughly</p>

      <div className="dashboard-card mt-8">
        <div className="flex justify-between items-center ">
          <div className="flex gap-3 flex-wrap">
            <div className="relative w-[73px] h-12">
              <div className="absolute w-12 h-12 z-10 rounded-full">
                <Image
                  src="/assets/profile-pic.png"
                  alt="profile picture"
                  fill
                  sizes="100%"
                  className="object-contain"
                />
              </div>

              <div className="absolute w-12 h-12 left-7 top-0 rounded-full">
                <Image
                  src="/assets/default-church-logo.png"
                  alt="profile picture"
                  fill
                  sizes="100%"
                  className="object-contain"
                />
              </div>
            </div>

            <div>
              <p className="dashboard-heading-text">{`${driver.firstName} ${driver.lastName}`}</p>
              <div className="text-a-12 text-gray-500 mt-2 flex items-center">
                <p>{driver?.department?.name || '--'}</p>

                <span className="mx-1 inline-flex items-center justify-center h-4 w-4 text-base">
                  &middot;
                </span>

                <p>{driver?.attendanceDuration || '--'}</p>
              </div>
            </div>
          </div>

          <Popover
            trigger={
              <Button className="h-max">
                <p>Actions</p>
                <SvgIcon name="arrow-down" className="w-4 h-4" />
              </Button>
            }
            align="end"
          >
            <div className="option-menu">
              <button
                onClick={() => handleApprove(driver.userId)}
                disabled={approvingUserId === driver.userId}
                className={
                  approvingUserId === driver.userId
                    ? 'opacity-60 cursor-not-allowed'
                    : ''
                }
              >
                <SvgIcon name="check" />
                <p>
                  {approvingUserId === driver.userId
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
                      className="bg-background rounded-20 p-5 xsm:p-10 max-w-[442px] mx-auto"
                      onSubmit={handleSubmit(
                        handleReturn(driver.userId, close)
                      )}
                    >
                      <Title className="text-3xl font-semibold mb-2">
                        Return Requests
                      </Title>
                      <Description className="text-gray-400">
                        Please share what the driver needs to correct
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
                                const types = Array.isArray(v) ? v : [];
                                field.onChange(types);
                              }}
                              placeholder="Select"
                              multiple
                            />
                          )}
                        />

                        {errors.types && errors.types.message && (
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
                            required: 'Please provide a return request',
                          })}
                          onChange={(e) => {
                            setValue('reason', e.target.value);
                          }}
                          className="mt-2 p-4 bg-gray-50 w-full rounded-8 h-40"
                          placeholder="Describe the request"
                        />
                        {errors.reason && errors.reason.message && (
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
                          {isSubmitting ? 'Sending...' : 'Send message'}
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
                      className="bg-background rounded-20 p-10 text-center max-w-[500px] mx-auto"
                      onSubmit={handleSubmit(
                        handleReject(driver.userId, close)
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
                        Reject {driver.firstName} {driver.lastName}
                      </Title>
                      <Description className="text-gray-400">
                        {driver.firstName} will receive the reason for rejection
                      </Description>

                      <div>
                        <textarea
                          className="mt-6 p-4 bg-gray-50 w-full rounded-8 h-40"
                          {...register('reason', {
                            required: 'Please provide a reason',
                            minLength: {
                              value: 10,
                              message: 'Reason must be at least 10 characters',
                            },
                          })}
                          onChange={(e) => setValue('reason', e.target.value)}
                          placeholder="Give a reason..."
                        />

                        {errors.reason && errors.reason.message && (
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
                          {isSubmitting ? 'Rejecting...' : 'Yes reject'}
                        </Button>
                      </div>
                    </form>
                  </FormProvider>
                )}
              </Modal>
            </div>
          </Popover>
        </div>

        <Tabs
          tabsStyle="flex-wrap"
          tabs={[
            {
              label: 'Personal details',
              content: (
                <ul className="">
                  <li className="dashboard-list-item">
                    <p>First name:</p>
                    <p>{driver.firstName}</p>
                  </li>
                  <li className="dashboard-list-item">
                    <p>Last name:</p>
                    <p>{driver.lastName}</p>
                  </li>
                  <li className="dashboard-list-item">
                    <p>Email:</p>
                    <p>{driver.email}</p>
                  </li>

                  <li className="dashboard-list-item">
                    <p>Gender:</p>
                    <p>{driver.gender || '--'}</p>
                  </li>
                  <li className="dashboard-list-item">
                    <p>Age:</p>
                    <p>
                      {driver.dateOfBirth
                        ? `${calculateAge(driver.dateOfBirth)} years (${dayjs(driver.dateOfBirth).format(DATE_FORMAT_DMY)})`
                        : '--'}
                    </p>
                  </li>
                  <li className="dashboard-list-item">
                    <p>Home address:</p>
                    <p>{driver.homeAddress || '--'}</p>
                  </li>
                </ul>
              ),
            },
            {
              label: 'Car details',
              content: (
                <>
                  <div className="flex justify-between overflow-x-auto gap-2">
                    {/* Left: selected vehicle summary */}
                    <div className="flex items-start gap-3">
                      <div className="text-a-14">
                        <p className="bg-gray-100 my-1 py-1 px-2 rounded w-max text-a-14 font-medium border border-dashed border-gray-300">
                          {selectedVehicle?.plateNumber || '--'}
                        </p>
                        <p className="capitalize">
                          {selectedVehicle?.carModel || '--'}
                        </p>
                      </div>
                    </div>

                    {/* Right: thumbnails for each vehicle */}
                    <div className="flex gap-3 items-center mr-2">
                      {driver.vehicles?.length ? (
                        driver.vehicles.map((el) => {
                          const isSelected = el.vehicleId === selectedVehicleId;
                          return (
                            <button
                              key={el.vehicleId}
                              type="button"
                              onClick={() => setSelectedVehicleId(el.vehicleId)}
                              className={`relative rounded overflow-hidden w-24 aspect-video ${isSelected ? 'ring-2 ring-primary-500' : ''}`}
                              aria-pressed={isSelected}
                            >
                              <Image
                                src="/assets/car.png"
                                alt="vehicle image"
                                fill
                                sizes="160px"
                                className="object-contain"
                              />
                            </button>
                          );
                        })
                      ) : (
                        <div className="text-sm text-gray-500">No vehicles</div>
                      )}
                    </div>
                  </div>

                  {/* Details list for the selected vehicle */}
                  <ul className="mt-4">
                    <li className="dashboard-list-item">
                      <p>Plate number:</p>
                      <p>{selectedVehicle?.plateNumber || '—-'}</p>
                    </li>
                    <li className="dashboard-list-item">
                      <p>Car model:</p>
                      <p>{selectedVehicle?.carModel || '—-'}</p>
                    </li>
                    <li className="dashboard-list-item">
                      <p>Year:</p>
                      <p>{selectedVehicle?.year || '—-'}</p>
                    </li>
                    <li className="dashboard-list-item">
                      <p>Color:</p>
                      <p>{selectedVehicle?.color || '—-'}</p>
                    </li>
                  </ul>
                </>
              ),
            },

            {
              label: 'Safety Check',
              content: (
                <>
                  <div className="flex justify-between overflow-x-auto gap-2">
                    <div className="flex items-start gap-3">
                      <div className="text-a-14">
                        <p className="bg-gray-100 my-1 py-1 px-2 rounded w-max text-a-14 font-medium border border-dashed border-gray-300">
                          {selectedVehicle?.plateNumber || '--'}
                        </p>
                        <p>{selectedVehicle?.carModel || '--'}</p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-center mr-2">
                      {driver.vehicles?.length ? (
                        driver.vehicles.map((el) => {
                          const isSelected = el.vehicleId === selectedVehicleId;
                          return (
                            <button
                              key={el.vehicleId}
                              type="button"
                              onClick={() => setSelectedVehicleId(el.vehicleId)}
                              className={`relative rounded overflow-hidden w-24 aspect-video ${isSelected ? 'ring-2 ring-primary-500' : ''}`}
                              aria-pressed={isSelected}
                            >
                              <Image
                                src="/assets/car.png"
                                alt="vehicle image"
                                fill
                                sizes="160px"
                                className="object-contain"
                              />
                            </button>
                          );
                        })
                      ) : (
                        <div className="text-sm text-gray-500">No vehicles</div>
                      )}
                    </div>
                  </div>

                  <ul className="">
                    <li className="dashboard-list-item">
                      <p>Owner of the car?:</p>
                      <p>
                        {driver.driverDocuments?.carInfo?.isOwner
                          ? 'Yes'
                          : '--'}
                      </p>
                    </li>
                    <li className="dashboard-list-item">
                      <p>Clearance to drive this car?:</p>
                      <p>
                        {' '}
                        {driver.driverDocuments?.carInfo?.clearanceToDrive
                          ? 'Yes'
                          : '--'}
                      </p>
                    </li>
                    <li className="dashboard-list-item">
                      <p>Driver’s license:</p>
                      <div className="flex flex-col items-end">
                        <ShowView
                          when={
                            !!selectedVehicle?.documents?.driverLicense?.fileUrl
                          }
                          fallback={<p className="text-primary-500">--</p>}
                        >
                          <DocumentLink
                            url={
                              selectedVehicle?.documents?.driverLicense?.fileUrl
                            }
                            label="Driver's license"
                          />
                        </ShowView>

                        <p>
                          <span>
                            {dayjs(
                              selectedVehicle?.documents?.driverLicense
                                ?.issuanceDate
                            ).format('DD/MM/YY')}
                          </span>
                          <span>{` - `}</span>
                          <span>
                            {dayjs(
                              selectedVehicle?.documents?.driverLicense
                                ?.expiryDate
                            ).format('DD/MM/YY')}
                          </span>
                        </p>
                      </div>
                    </li>

                    <li className="dashboard-list-item">
                      <p>Car insurance:</p>
                      <div className="flex flex-col items-end">
                        <ShowView
                          when={
                            !!selectedVehicle?.documents?.carInsurance?.fileUrl
                          }
                          fallback={<p className="text-primary-500">--</p>}
                        >
                          <DocumentLink
                            url={
                              selectedVehicle?.documents?.carInsurance?.fileUrl
                            }
                            label="Car insurance"
                          />
                        </ShowView>

                        <p>
                          <span>
                            {dayjs(
                              selectedVehicle?.documents?.carInsurance
                                ?.issuanceDate
                            ).format('DD/MM/YY')}
                          </span>
                          <span>{` - `}</span>
                          <span>
                            {dayjs(
                              selectedVehicle?.documents?.carInsurance
                                ?.expiryDate
                            ).format('DD/MM/YY')}
                          </span>
                        </p>
                      </div>
                    </li>
                    <li className="dashboard-list-item">
                      <p>Certificate of ownership:</p>
                      <div className="flex flex-col items-end">
                        <ShowView
                          when={
                            !!selectedVehicle?.documents?.certificateOfOwnership
                              ?.fileUrl
                          }
                          fallback={<p className="text-primary-500">--</p>}
                        >
                          <DocumentLink
                            url={
                              selectedVehicle?.documents?.certificateOfOwnership
                                ?.fileUrl
                            }
                            label="Certificate of ownership"
                          />
                        </ShowView>

                        <p>
                          <span>
                            {dayjs(
                              selectedVehicle?.documents?.certificateOfOwnership
                                ?.issuanceDate
                            ).format('DD/MM/YY')}
                          </span>
                          <span>{` - `}</span>
                          <span>
                            {dayjs(
                              selectedVehicle?.documents?.certificateOfOwnership
                                ?.expiryDate
                            ).format('DD/MM/YY')}
                          </span>
                        </p>
                      </div>
                    </li>
                    <li className="dashboard-list-item">
                      <p>Road worthiness:</p>
                      <div className="flex flex-col items-end">
                        <ShowView
                          when={
                            !!selectedVehicle?.documents?.roadWorthiness
                              ?.fileUrl
                          }
                          fallback={<p className="text-primary-500">--</p>}
                        >
                          <DocumentLink
                            url={
                              selectedVehicle?.documents?.roadWorthiness
                                ?.fileUrl
                            }
                            label="Road worthiness"
                          />
                        </ShowView>

                        <p>
                          <span>
                            {dayjs(
                              selectedVehicle?.documents?.roadWorthiness
                                ?.issuanceDate
                            ).format('DD/MM/YY')}
                          </span>
                          <span>{` - `}</span>
                          <span>
                            {dayjs(
                              selectedVehicle?.documents?.roadWorthiness
                                ?.expiryDate
                            ).format('DD/MM/YY')}
                          </span>
                        </p>
                      </div>
                    </li>
                  </ul>
                </>
              ),
            },
          ]}
        ></Tabs>
      </div>
    </div>
  );
};

export default ReviewDriverApplication;
