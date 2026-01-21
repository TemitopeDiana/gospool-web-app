import { DATE_FORMAT_DMY } from '@/lib/constants';
import { routes } from '@/lib/routes';
import { Department } from '@/types/church.type';
import dayjs from 'dayjs';
import Link from 'next/link';
import { Button } from './button';
import CreateChurchDepartmentModal from './create-church-department-modal';
import DeleteChurchDepartmentModal from './delete-church-department-modal.';
import Drawer from './drawer';
import CreateChurchDepartmentForm from './forms/create-department.form';
import NoDataCard from './no-data-card';
import Popover from './popover';
import ShowView from './show-view';
import SvgIcon from './svg-icon';

interface Props {
  departments: Department[];
  branchId: string;
}

const ChurchDepartmentTable = ({ departments, branchId }: Props) => {
  return (
    <>
      <ShowView when={!!departments.length}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Date Created</th>
                <th>Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {departments.map((el, index) => (
                <tr key={index}>
                  <td>{dayjs(el.createdAt).format(DATE_FORMAT_DMY)}</td>
                  <td className="py-6 px-3 capitalize">{el.name}</td>
                  {/* <td>
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
                           </td> */}
                  <td className="capitalize">{el.description}</td>

                  <td>
                    <Popover
                      trigger={
                        <button className="block w-max">
                          <SvgIcon name="dotted-menu" className="w-7 h-5" />
                        </button>
                      }
                    >
                      <ul className="table-action-popover">
                        <li>
                          <Link
                            href={`${routes.driverProfile(el._id)}`}
                            className="flex items-center gap-2"
                          >
                            <SvgIcon
                              name="eye"
                              className="h-4 w-4 text-gray-500"
                            />
                            View
                          </Link>
                        </li>
                        <li className="">
                          <Drawer
                            disableEscapeDown
                            disableOutsideClick
                            title="Edit Department"
                            trigger={
                              <button>
                                <SvgIcon name="edit" />
                                <p>Edit</p>
                              </button>
                            }
                          >
                            {(close) => (
                              <CreateChurchDepartmentForm
                                close={close}
                                values={{
                                  name: el.name,
                                  description: el.description,
                                }}
                                edit
                                departmentId={el.departmentId}
                              />
                            )}
                          </Drawer>
                        </li>
                        <li className="text-error-700">
                          <DeleteChurchDepartmentModal
                            trigger={
                              <button>
                                <SvgIcon
                                  name="user-minus"
                                  className="text-error-700"
                                />
                                <p className="text-error-700">Delete</p>
                              </button>
                            }
                            departmentId={el.departmentId}
                            name={el.name}
                          />
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

      <ShowView when={!departments.length}>
        <NoDataCard
          heading="No departments found"
          description="This branch hasn't added any church departments yet."
        >
          <CreateChurchDepartmentModal
            trigger={<Button className="mx-auto mt-5">Add Department</Button>}
            branchId={branchId}
          />
        </NoDataCard>
      </ShowView>
    </>
  );
};

export default ChurchDepartmentTable;
