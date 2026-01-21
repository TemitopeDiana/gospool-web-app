import { DATE_FORMAT_DMY } from '@/lib/constants';
import { ChurchService } from '@/types/services.type';
import dayjs from 'dayjs';
import { Button } from './button';
import CreateChurchServiceModal from './create-church-service-modal';
import DeleteChurchServiceModal from './delete-church-service-modal';
import Drawer from './drawer';
import UpdateChurchServiceForm from './forms/update-service-form';
import NoDataCard from './no-data-card';
import Popover from './popover';
import ShowView from './show-view';
import SvgIcon from './svg-icon';

interface Props {
  services: ChurchService[];
  branchId: string;
}

const ChurchServicesTable = ({ services, branchId }: Props) => {
  return (
    <>
      <ShowView when={!!services.length}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Date Created</th>
                <th>Name</th>
                <th>Day</th>
                <th>Time</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {services.map((el, index) => (
                <tr key={index}>
                  <td>{dayjs(el.createdAt).format(DATE_FORMAT_DMY)}</td>
                  <td className="py-6 px-3 capitalize">{el.name}</td>

                  <td className="capitalize">{el.day}</td>
                  <td>{el.time}</td>

                  <td>
                    <Popover
                      trigger={
                        <button className="block w-max">
                          <SvgIcon name="dotted-menu" className="w-7 h-5" />
                        </button>
                      }
                    >
                      <ul className="table-action-popover">
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
                              <UpdateChurchServiceForm
                                close={close}
                                values={{
                                  name: el.name,
                                  day: el.day,
                                  time: el.time,
                                }}
                                branchId={branchId}
                                serviceId={el.serviceId}
                              />
                            )}
                          </Drawer>
                        </li>
                        <li className="text-error-700">
                          <DeleteChurchServiceModal
                            trigger={
                              <button>
                                <SvgIcon
                                  name="user-minus"
                                  className="text-error-700"
                                />
                                <p className="text-error-700">Delete</p>
                              </button>
                            }
                            branchId={branchId}
                            serviceId={el.serviceId}
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

      <ShowView when={!services.length}>
        <NoDataCard
          heading="No services found"
          description="This branch hasn't added any church services yet."
        >
          <CreateChurchServiceModal
            trigger={<Button className="mx-auto mt-5">Add Service</Button>}
            branchId={branchId}
          />
        </NoDataCard>
      </ShowView>
    </>
  );
};

export default ChurchServicesTable;
