'use client';
import { Description, Title } from '@radix-ui/react-dialog';
import dayjs from 'dayjs';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { Button } from './button';
import Modal from './modal-component';
import Popover from './popover';
import StatusTag from './status-tag';
import SvgIcon from './svg-icon';
import ShowView from './show-view';
import NoDataCard from './no-data-card';
import { exportDriversCsv, exportDriversPdf } from './export-drivers';

import { DATE_FORMAT_DMY } from '@/lib/constants';
import { routes } from '@/lib/routes';
import { Driver } from '@/types/driver.type';
import { UserProfile } from '@/types/user.type';
import profilePic from '@/public/assets/profile-pic.png';

interface DriversPageProps {
  user?: UserProfile | null;
  driversData?: Driver[];
  totalDrivers?: number;
  initialStatus: string;
}

type downloadFormat = 'csv' | 'pdf';

const DriversPageComponent = ({
  user,
  driversData,
  totalDrivers,
  initialStatus,
}: DriversPageProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const driverStatus = searchParams.get('status') ?? 'pending';
  const [downloadFormat, setDownloadFormat] = useState<downloadFormat>('csv');

  const handleFilterChange = (status: string) => {
    const page = searchParams.get('page') ?? '1';
    const limit = searchParams.get('limit') ?? '10';

    router.push(`/drivers?status=${status}&page=${page}&limit=${limit}`);
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

    toast.success(`${type.toUpperCase()} download started`);
    close();
  };

  console.log(user, totalDrivers);

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
            <div className="px-5 py-10 bg-white rounded-20 mx-auto shadow-lg focus:outline-none md:px-10 max-w-[442px]">
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
                        ? '--'
                        : dayjs(el.driverVerifiedAt).format(DATE_FORMAT_DMY)}
                    </td>
                    <td className="px-4 py-3">
                      {el.firstName + ' ' + el.lastName}
                    </td>
                    <td>
                      {' '}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative flex-none w-10 h-10 rounded-full overflow-hidden">
                          <Image
                            src={profilePic} //dynamic -- to be updated later
                            alt={
                              el.churchName
                                ? `${el.churchName} avatar`
                                : 'avatar'
                            }
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate capitalize">
                            {el.churchName || '--'}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {el.branchName || '—-'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{el.departmentName}</td>

                    <td className="px-4 py-3">
                      {el.driverVerificationStatus === 'pending' ? (
                        <StatusTag warning text="Pending" />
                      ) : (
                        <StatusTag text="Active" />
                      )}
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
                          {el.driverVerificationStatus === 'approved' ? ( //TO BE SWAPPED TO PENDING
                            <>
                              <Link href={`${routes.driverProfile(el.userId)}`}>
                                <SvgIcon name="eye" />
                                <p>View</p>
                              </Link>
                              <button>
                                <SvgIcon name="check" />
                                <p>Approve</p>
                              </button>
                              <button>
                                <SvgIcon name="refresh" />
                                <p>Return</p>
                              </button>
                              <button className="text-error-700">
                                <SvgIcon name="flag" />
                                <p>Reject</p>
                              </button>
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
                              <button>
                                <SvgIcon
                                  name="user-minus"
                                  className="text-error-700"
                                />
                                <p className="text-error-700">Block</p>
                              </button>
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
