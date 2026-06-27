'use client';

import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';
import dayjs from 'dayjs';

import { Button } from '@/components/button';
import ConfirmActionCard from './confirm-action-card';
import Drawer from './drawer';
import Modal from './modal-component';
import CreateTeamForm from './forms/create-team.form';

import { toggleChurchStatus } from '@/actions/toggleChurchStatus';
import { routes } from '@/lib/routes';
import { useRouter } from 'next/navigation';
import { TeamMember } from '@/types/user.type';

interface UserShape {
  user?: { firstName?: string; lastName?: string } | null;
}

interface HomePageProps {
  user: UserShape | null;
  teamsData: TeamMember[];
  totalChurches: number;
  totalRides: number;
  totalDrivers: number;
  totalPassengers: number;
}

const TeamsPage = ({
  teamsData,
}: Omit<HomePageProps, 'branchData' | 'totalBranches' | 'churchData'>) => {
  const router = useRouter();
  const [isTogglingChurchStatus, setIsTogglingChurchStatus] = useState(false);

  const handleTeamStatusToggle = async (
    churchId: string,
    close: () => void
  ) => {
    setIsTogglingChurchStatus(true);

    try {
      const result = await toggleChurchStatus(churchId);

      if (result.success) {
        toast.success(result.message);
        close();
      } else {
        toast.error(result.message);
      }
    } finally {
      setIsTogglingChurchStatus(false);
    }
  };

  return (
    <div>
      <div className="w-full md:mt-5.75">
        <div className="xsm:flex justify-between items-center">
          <div>
            <h1 className="text-xl font-medium mb-2 md:text-3xl">
              Team members
            </h1>
            <p className="text-gray-500 text-xs md:text-base">
              Admin - Gospool
            </p>
          </div>

          <Drawer
            trigger={
              <Button
                type="button"
                className="block capitalize mb-2 mt-2 ml-auto xsm:m-0"
              >
                Add Team
              </Button>
            }
            title="Create Team"
            description="Enter details to begin"
            disableEscapeDown
            disableOutsideClick
          >
            {(close) => <CreateTeamForm close={close} />}
          </Drawer>
        </div>

        {/* table  */}
        <div className="dashboard-card mt-5">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Date added</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {teamsData?.map((el, index) => {
                  const isActive = el.isActive;
                  const statusLabel = isActive ? 'Disable' : 'Enable';

                  return (
                    <tr
                      key={index}
                      onClick={() =>
                        router.push(routes.teamProfile(el.teamId || ''))
                      }
                      className="cursor-pointer"
                    >
                      <td className="py-6 px-3 capitalize">
                        {dayjs(el.createdAt).format('DD MMM')}
                      </td>
                      <td className="capitalize">
                        <div className="flex items-center gap-2">
                          <span className="relative block w-9 h-9 rounded-full aspect-square overflow-hidden ">
                            <Image
                              src={el.avatar || '/assets/a.png'}
                              alt={el.firstName}
                              fill
                              sizes="24px"
                            />
                          </span>
                          <span className="inline-block">
                            {el.firstName} {el.lastName}
                          </span>
                        </div>
                      </td>
                      <td className="py-6 px-3 capitalize">{el.roles?.[0]}</td>
                      <td>
                        <Modal
                          hideCloseButton
                          disableOutsideClick
                          trigger={
                            <button
                              className={`${isActive ? 'bg-green-500 active' : 'bg-gray-100'} toggle-button`}
                            />
                          }
                        >
                          {(close) => (
                            <ConfirmActionCard
                              close={close}
                              title={`${statusLabel} ${el.firstName} ${el.lastName}`}
                              icon="toggle"
                              description={`Are you sure you want to ${statusLabel} this team member?`}
                              confirmAction={{
                                buttonText: statusLabel,
                                onClick: () =>
                                  handleTeamStatusToggle(el.teamId, close),
                                loading: isTogglingChurchStatus,
                              }}
                            />
                          )}
                        </Modal>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export { TeamsPage };
