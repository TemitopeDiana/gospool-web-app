import React, { useState } from 'react';
import ShowView from './show-view';
import NoDataCard from './no-data-card';
import Link from 'next/link';
import SvgIcon from './svg-icon';
import HoverCard from './hover-card';
import Modal from './modal-component';
import ConfirmActionCard from './confirm-action-card';
import { routes } from '@/lib/routes';
import { toast } from 'sonner';
import dayjs from 'dayjs';
import { DATE_FORMAT_DMY } from '@/lib/constants';
import { User } from '@/types/user.type';
import { toggleUserStatus } from '@/actions/toggleUserStatus';

interface Props {
  drivers: User[];
}

const DriversTable = ({ drivers }: Props) => {
  const [isDriverStatus, setIsDriverStatus] = useState(false);

  const handleToggleDriverStatus = async (
    userId: string,
    close: () => void
  ) => {
    setIsDriverStatus(true);

    try {
      const result = await toggleUserStatus(userId);

      if (result.success) {
        toast.success(result.message);
        close();
      } else {
        toast.error(result.message);
      }
    } finally {
      setIsDriverStatus(false);
    }
  };

  return (
    <>
      <ShowView when={!!drivers.length}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Date Joined</th>
                <th>Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {drivers.map((el, index) => {
                const statusLabel = el.isActive ? 'Disable' : 'Enable';

                return (
                  <tr key={index}>
                    <td>{dayjs(el.createdAt).format(DATE_FORMAT_DMY)}</td>
                    <td className="py-6 px-3 capitalize">
                      {el.firstName} {el.lastName}
                    </td>
                    <td>
                      <Modal
                        hideCloseButton
                        disableOutsideClick
                        trigger={
                          <button
                            className={`${el.isActive ? 'bg-green-500 active' : 'bg-gray-100'} toggle-button`}
                          />
                        }
                      >
                        {(close) => (
                          <ConfirmActionCard
                            close={close}
                            title={`${statusLabel} ${el.firstName} ${el.lastName}`}
                            icon="toggle"
                            description={`Are you sure you want to ${statusLabel} this user?`}
                            confirmAction={{
                              buttonText: statusLabel,
                              onClick: () =>
                                handleToggleDriverStatus(el.userId, close),
                              loading: isDriverStatus,
                            }}
                          />
                        )}
                      </Modal>
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
                              href={`${routes.driverProfile(el.userId)}`}
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
                );
              })}
            </tbody>
          </table>
        </div>
      </ShowView>

      <ShowView when={!drivers.length}>
        <NoDataCard
          heading="No Driver yet"
          description="This church has no driver yet."
        />
      </ShowView>
    </>
  );
};

export default DriversTable;
