'use client';

import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts';
import { toast } from 'sonner';

import { Button } from './button';
import ConfirmActionCard from './confirm-action-card';
import Drawer from './drawer';
import ExtendedRideDetails from './extended-ride-details';
import Modal from './modal-component';
import Popover from './popover';
import StarRating from './start-rating';
import SvgIcon from './svg-icon';

import { routes } from '@/lib/routes';

const data = [
  {
    name: 'Jan',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Feb',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Mar',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
];

const RideDetails = () => {
  const router = useRouter();

  return (
    <div>
      <div className="flex">
        <div className="flex gap-4 flex-1 max-w-a-150">
          <div className="p-3 border border-gray-200 w-max h-max text-primary rounded-full aspect-square">
            <SvgIcon name="car" className="w-4 h-4" />
          </div>

          <div>
            <p className="font-medium text-a-18 md:text-a-20">4</p>
            <p className="text-gray-500">Rides</p>
          </div>
        </div>

        <div className="flex gap-4 flex-1 max-w-a-150">
          <div className="p-3 border border-gray-200 w-max h-max text-primary rounded-full aspect-square">
            <SvgIcon name="close" className="w-4 h-4" />
          </div>

          <div>
            <p className="font-medium text-a-18 md:text-a-20">0</p>
            <p className="text-gray-500">Cancelled</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-7 mb-4">
        <p className="font-medium">Analytics</p>

        <Popover
          trigger={
            <Button variant="outline" className="flex gap-2 items-center">
              3 months
              <SvgIcon name="arrow-down" className="w-4 h-4" />
            </Button>
          }
        >
          <div className="option-menu">
            <p>6 months</p>
            <p>1 year</p>
          </div>
        </Popover>
      </div>

      <ResponsiveContainer className="min-h-52">
        <LineChart
          data={data}
          className="w-full left-5"
          margin={{ top: 5, right: 30, left: 15, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <Tooltip />
          <Line type="monotone" dataKey="pv" stroke="#8884d8" />
          <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-14">
        <p className="font-medium text-gray-800 text-a-16 md:text-a-18">
          Reviews
        </p>

        <div className="flex justify-between items-start mt-5">
          <div className="flex-1">
            <StarRating rating={4.1} />

            <p className="my-2 line-clamp-1 text-gray-600">
              The driver was nice, and he arrived on time
            </p>

            <p className="text-gray-400 text-a-12">
              {dayjs().format('MMM DD')}
            </p>
          </div>

          <Popover
            trigger={
              <button>
                <SvgIcon name="dotted-menu" className="w-5 h-5 rotate-90" />
              </button>
            }
            align="end"
          >
            <div className="option-menu">
              <Drawer
                trigger={
                  <button>
                    <SvgIcon name="eye" />
                    <p>View</p>
                  </button>
                }
                title="Ride details"
                description={''}
              >
                <ExtendedRideDetails />
              </Drawer>

              <Modal
                hideCloseButton
                trigger={
                  <div className="text-error-700">
                    <SvgIcon name="trash" />
                    <p>Delete</p>
                  </div>
                }
              >
                {(close) => (
                  <ConfirmActionCard
                    title="Delete Passenger"
                    description="What action would you like to take?"
                    close={close}
                    confirmAction={{
                      buttonText: 'Delete',
                      onClick: () => {
                        toast.success('I was clicked');
                        router.push(routes.passengers());
                      },
                    }}
                    dangerColor
                  />
                )}
              </Modal>
            </div>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default RideDetails;
