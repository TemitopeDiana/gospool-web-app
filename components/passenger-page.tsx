'use client';
import { Description, Title } from '@radix-ui/react-dialog';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';

import { DATE_FORMAT_DMY } from '@/lib/constants';
import { routes } from '@/lib/routes';
import { Button } from './button';
import Modal from './modal-component';
import Popover from './popover';
import ShowView from './show-view';
import SvgIcon from './svg-icon';

import { User } from '@/types/user.type';
import { getChurchLogo } from '@/actions/get-church-logo';

interface Props {
  passengers: User[];
}

const ChurchLogoImage = ({ churchId }: { churchId: string }) => {
  const [logoUrl, setLogoUrl] = useState<string>('/assets/favicon.png');

  useEffect(() => {
    const fetchLogo = async () => {
      const churchLogo = await getChurchLogo(churchId);
      setLogoUrl(churchLogo.logoUrl || '/assets/favicon.png');
    };
    fetchLogo();
  }, [churchId]);

  return (
    <Image
      src={logoUrl}
      alt="logo"
      width={24}
      height={24}
      className="rounded-full"
    />
  );
};

const PassengerPageComponent = ({ passengers }: Props) => {
  return (
    <div>
      <div className="flex justify-between mb-5">
        <div className="dashboard-heading-text">Passenger</div>

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
                <Button variant="gray">
                  <SvgIcon name="csv" className="w-5 h-5 text-black" />
                  CSV
                </Button>
                <Button variant="gray">
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
                    toast.success('Download started');
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
              {passengers.map((el) => (
                <tr
                  key={el._id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    {dayjs(el.createdAt).format(DATE_FORMAT_DMY)}
                  </td>
                  <td className="px-4 py-3">{`${el.lastName} ${el.firstName}`}</td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    <ShowView when={!!el.church}>
                      <ChurchLogoImage
                        churchId={el.church?.churchId as string}
                      />
                      <div>
                        <p className="font-medium">
                          {el?.church?.name || '---'}
                        </p>
                        <p className="text-a-12 text-gray-500">
                          {el?.branch?.name || '---'}
                        </p>
                      </div>
                    </ShowView>

                    <ShowView when={!el.church}>---</ShowView>
                  </td>
                  <td className="px-4 py-3">{el?.department?.name || '---'}</td>
                  <td className="px-4 py-3 text-gray-500 ">
                    <Popover
                      trigger={
                        <button className="m-auto block w-max">
                          <SvgIcon name="dotted-menu" className="w-7 h-5" />
                        </button>
                      }
                    >
                      <ul className="table-action-popover">
                        <li>
                          <Link
                            href={`${routes.passengerProfile(el.userId)}`}
                            className="flex items-center gap-2"
                          >
                            <SvgIcon
                              name="eye"
                              className="h-4 w-4 text-gray-500"
                            />
                            View Profile
                          </Link>
                        </li>
                      </ul>
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
