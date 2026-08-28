'use client';

import Image from 'next/image';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import dayjs from 'dayjs';

import { DAY_MONTH_FORMAT, TIME_FORMAT_12HR } from '@/lib/constants';

import { Button } from './button';
import SvgIcon from './svg-icon';
import ShowView from './show-view';
import ToolTip from './tooltip';
import StatusTag from './status-tag';
import NoDataCard from './no-data-card';
import Popover from './popover';

interface EventsPageProps {
  initialEventType: string;
}

interface EventsDataProps {
  date: string;
  event: {
    src: string;
    name: string;
    address: string;
  };
  church: string;
  department: string;
  status: string;
}

const EventData: EventsDataProps[] = [
  {
    // ISO datetime string (date + time) so component can format separately
    date: '2023-08-01T19:00:00',
    event: {
      src: '/assets/deafult-church-logo.png',
      name: 'Holy Ghost Night',
      address: '123 Main St, City, State 12345',
    },
    church: 'CCI Intl',
    department: 'Department X',
    status: 'pending',
  },
  {
    date: '2023-08-02T20:30:00',
    event: {
      src: '/assets/deafult-church-logo.png',
      name: 'Night of glory',
      address:
        '456 Oak Ave, City, State 12345 456 Oak Ave, City, State 12345  12345 456 Oak Ave, City, State 12345',
    },
    church: 'Church B',
    department: 'Department Y',
    status: 'single',
  },
  {
    date: '2023-08-03T18:15:00',
    event: {
      src: '/assets/deafult-church-logo.png',
      name: 'Event 3',
      address: '789 Pine Rd, City, State 12345',
    },
    church: 'Church C',
    department: 'Department Z',
    status: 'public',
  },
  {
    date: '2023-08-04T21:45:00',
    event: {
      src: '/assets/deafult-church-logo.png',
      name: 'Event 4',
      address: '101 Maple St, City, State 12345',
    },
    church: 'Church D',
    department: 'Department W',
    status: 'expired',
  },
];

const MAX_TOOLTIP_CHARS = 40;

const EventsPage = ({ initialEventType }: EventsPageProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentEventType = searchParams?.get('status') ?? initialEventType;

  const handleFilterChange = (eventType: string) => {
    const params = new URLSearchParams(searchParams?.toString() ?? '');
    params.set('status', eventType);
    if (!params.get('page')) params.set('page', '1');
    if (!params.get('limit')) params.set('limit', '10');

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <div className="flex justify-between mb-5">
        <div>
          <h1 className="dashboard-heading-text">Events</h1>
          <p className="mt-1">Manage events for gospool</p>
        </div>
        <div>
          <Button>Create event</Button>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="flex flex-wrap justify-between items-center mb-5 gap-3">
          <div className="flex gap-2">
            <Button
              variant={currentEventType === 'gospool' ? 'default' : 'outline'}
              onClick={() => handleFilterChange('gospool')}
            >
              Gospool
            </Button>
            <Button
              variant={currentEventType === 'churches' ? 'default' : 'outline'}
              onClick={() => handleFilterChange('churches')}
            >
              Churches
            </Button>
            <Button
              variant={currentEventType === 'team' ? 'default' : 'outline'}
              onClick={() => handleFilterChange('team')}
            >
              Team
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

        <ShowView when={!!EventData?.length}>
          <div className="overflow-x-auto rounded-t-xl ">
            <table className="w-full text-left text-a-14">
              <thead className="rounded-xl overflow-hidden">
                <tr className="bg-gray-50  [&>th]:px-4 [&>th]:py-3 [&>th]:font-medium text-base-black">
                  <th>Date</th>
                  <th>Event name</th>
                  <th>Host</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {EventData.map((event, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p>{dayjs(event.date).format(DAY_MONTH_FORMAT)}</p>
                        <p className="text-gray-500">
                          {dayjs(event.date).format(TIME_FORMAT_12HR)}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="relative flex-none w-10 h-10 overflow-hidden rounded-sm">
                          <Image
                            src={event?.event?.src}
                            alt={
                              event?.event?.src
                                ? `${event?.event?.src} avatar`
                                : 'avatar'
                            }
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate capitalize max-w-60">
                            {event?.event?.name}
                          </p>
                          {event?.event?.address?.length > MAX_TOOLTIP_CHARS ? (
                            <ToolTip
                              content={event?.event?.address}
                              trigger={
                                <p className="max-w-40 xsm:max-w-80 truncate text-xs text-gray-500">
                                  {event?.event?.address}
                                </p>
                              }
                            />
                          ) : (
                            <p className="truncate text-xs text-gray-500 max-w-60">
                              {event?.event?.address}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="relative flex-none w-10 h-10 rounded-full overflow-hidden">
                          <Image
                            src={event?.event?.src}
                            alt={
                              event?.event?.src
                                ? `${event?.event?.src} avatar`
                                : 'avatar'
                            }
                            fill
                            sizes="40px"
                            className="rounded-full object-cover"
                          />
                        </div>
                        <p> {event.church}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 capitalize">
                      <StatusTag
                        warning={event?.status == 'pending'}
                        danger={event?.status == 'expired'}
                        gray={
                          event?.status == 'single' ||
                          event?.status == 'limited'
                        }
                        success={event?.status == 'public'}
                        text={event.status}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Popover
                        trigger={
                          <button className="block w-max">
                            <SvgIcon name="dotted-menu" className="w-7 h-5" />
                          </button>
                        }
                      >
                        <ul className="table-action-popover">
                          <li className="">
                            <button>
                              <SvgIcon name="check" />
                              <p>Approve</p>
                            </button>
                          </li>
                          <li className="text-error-700">
                            <button>
                              <SvgIcon name="flag" className="text-error-700" />
                              <p className="text-error-700">Reject</p>
                            </button>
                          </li>
                        </ul>
                      </Popover>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ShowView>

        <ShowView when={!EventData?.length}>
          <NoDataCard heading="No Events yet" description={''} />
        </ShowView>
      </div>
    </>
  );
};

export default EventsPage;
