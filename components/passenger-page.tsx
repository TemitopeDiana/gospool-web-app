import dayjs from 'dayjs';
import Image from 'next/image';

import { Button } from './button';
import SvgIcon from './svg-icon';
import Popover from './popover';
import Link from 'next/link';
import { routes } from '@/lib/routes';
import { DATE_FORMAT_DMY } from '@/lib/constants';

const PassengerPageComponent = () => {
  return (
    <div className="max-w">
      <div className="flex justify-between mb-5">
        <div className="dashboard-heading-text">Passenger</div>

        <Button>Download</Button>
      </div>

      <div className="dashboard-card">
        <div className="flex justify-between gap-4 mb-4">
          <div className="flex gap-2 items-center px-3  bg-gray-50 rounded-xl w-full max-w-a-300">
            <SvgIcon name="search" className="w-5 h-5 text-gray-500" />
            <input type="search" name="" id="" className="flex-1 py-2" />
          </div>

          <div className="flex gap-2 justify-between items-center px-3  bg-gray-50 rounded-xl w-full max-w-32">
            All
            <SvgIcon name="arrow-down" className="w-4 h-4 text-gray-500" />
          </div>
        </div>

        <div className="overflow-x-auto rounded-t-xl ">
          <table className="w-full text-left text-a-14">
            <thead className="rounded-xl overflow-hidden">
              <tr className="bg-gray-50  [&>th]:px-4 [&>th]:py-3 [&>th]:font-medium text-base-black">
                <th>Date joined</th>
                <th>Name</th>
                <th>Churches</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {Array.from({ length: 4 }).map((_, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    {dayjs('2025-01-12').format(DATE_FORMAT_DMY)}
                  </td>
                  <td className="px-4 py-3">Paul Oluwatoni</td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    <Image
                      src="/assets/favicon.png"
                      alt="logo"
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-medium">Harvesters</p>
                      <p className="text-a-12 text-gray-500">Gbagada</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">Tech</td>
                  <td className="px-4 py-3 text-gray-500 ">
                    <Popover
                      trigger={
                        <button className="m-auto block w-max">
                          <SvgIcon name="dotted-menu" className="w-7 h-5" />
                        </button>
                      }
                    >
                      <div className="w-full bg-white border border-gray-100 text-a-12 rounded font-semibold [&>*]:block [&>*]:py-3 [&>*]:px-5">
                        <Link
                          href={`${routes.passengerProfile(idx.toString())}`}
                        >
                          View Profile
                        </Link>
                      </div>
                    </Popover>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PassengerPageComponent;
