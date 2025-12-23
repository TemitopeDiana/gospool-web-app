import dayjs from 'dayjs';
import Link from 'next/link';

import DeleteUserModal from './delete-user-modal';
import HoverCard from './hover-card';
import NoDataCard from './no-data-card';
import ShowView from './show-view';
import SvgIcon from './svg-icon';
import ToggleUserStatus from './toggle-user-status-modal';

import { DATE_FORMAT_DMY } from '@/lib/constants';
import { routes } from '@/lib/routes';
import { User } from '@/types/user.type';

interface Props {
  passengers: User[];
}

const PassengersTable = ({ passengers }: Props) => {
  return (
    <>
      <ShowView when={!!passengers.length}>
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
              {passengers.map((el, index) => (
                <tr key={index}>
                  <td>{dayjs(el.createdAt).format(DATE_FORMAT_DMY)}</td>
                  <td className="py-6 px-3 capitalize">
                    {el.firstName} {el.lastName}
                  </td>
                  <td>
                    <ToggleUserStatus
                      trigger={
                        <button
                          className={`${el.isActive ? 'bg-green-500 active' : 'bg-gray-100'} toggle-button`}
                        />
                      }
                      userId={el.userId}
                      name={`${el.firstName} ${el.lastName}`}
                      isActive={el.isActive}
                    />
                  </td>

                  <td>
                    <HoverCard
                      trigger={
                        <button className="block w-max ml-auto">
                          <SvgIcon name="dotted-menu" className="w-7 h-5" />
                        </button>
                      }
                      align="end"
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
                            View
                          </Link>
                        </li>
                        <li>
                          <DeleteUserModal
                            trigger={
                              <button>
                                <SvgIcon
                                  name="user-minus"
                                  className="text-error-700"
                                />
                                <p className="text-error-700">Delete</p>
                              </button>
                            }
                            userId={el.userId}
                            name={`${el.firstName} ${el.lastName}`}
                          />
                        </li>
                      </ul>
                    </HoverCard>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ShowView>

      <ShowView when={!passengers.length}>
        <NoDataCard
          heading="No Passenger yet"
          description="This church has no passenger yet."
        />
      </ShowView>
    </>
  );
};

export default PassengersTable;
