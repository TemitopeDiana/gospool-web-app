import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

import ConfirmActionCard from './confirm-action-card';
import HoverCard from './hover-card';
import Modal from './modal-component';
import NoDataCard from './no-data-card';
import ShowView from './show-view';
import SvgIcon from './svg-icon';

import { deleteChurchBranch } from '@/actions/deleteChurchBranch';
import { toggleChurchBranchStatus } from '@/actions/toggleChurchBranchStatus';
import { routes } from '@/lib/routes';
import { type Branch } from '@/types/church.type';

interface Props {
  branches: Branch[];
}

const BranchesTable = ({ branches }: Props) => {
  const [isTogglingChurchBranchStatus, setIsTogglingChurchBranchStatus] =
    useState(false);
  const [isDeletingChurch, setIsDeletingChurch] = useState(false);

  const handleChurchStatusToggle = async (
    branchId: string,
    status: boolean,
    close: () => void
  ) => {
    setIsTogglingChurchBranchStatus(true);

    try {
      const result = await toggleChurchBranchStatus(branchId, status);

      if (result.success) {
        toast.success(result.message);
        close();
      } else {
        toast.error(result.message);
      }
    } finally {
      setIsTogglingChurchBranchStatus(false);
    }
  };

  const handleDeleteChurch = async (
    branchId: string,
    churchId: string,
    close: () => void
  ) => {
    setIsDeletingChurch(true);

    try {
      const result = await deleteChurchBranch(branchId, churchId);

      if (result.success) {
        toast.success(result.message);
        close();
      } else {
        toast.error(result.message);
      }
    } finally {
      setIsDeletingChurch(false);
    }
  };

  return (
    <>
      <ShowView when={!!branches.length}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Date Created</th>
                <th>Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {branches.map((el, index) => {
                const isActive = el.status === 'active';
                const statusLabel = isActive ? 'Disable' : 'Enable';

                return (
                  <tr key={index}>
                    <td>{el.formattedDate}</td>
                    <td className="py-6 px-3 capitalize">{el.name}</td>
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
                            title={`${statusLabel} ${el.name}`}
                            icon="toggle"
                            description={`Are you sure you want to ${statusLabel} this church?`}
                            confirmAction={{
                              buttonText: statusLabel,
                              onClick: () =>
                                handleChurchStatusToggle(
                                  el.branchId,
                                  isActive ? false : true,
                                  close
                                ),
                              loading: isTogglingChurchBranchStatus,
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
                              href={`${routes.branchPage(el.churchId, el.branchId)}`}
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
                            <Modal
                              trigger={
                                <button className="flex items-center gap-2">
                                  <SvgIcon name="trash" className="h-4 w-4" />
                                  Delete
                                </button>
                              }
                              hideCloseButton
                              disableOutsideClick
                            >
                              {(close) => (
                                <ConfirmActionCard
                                  close={close}
                                  title={`Delete ${el.name}`}
                                  description="Current members will need to update their church. Prefer to disable it instead?"
                                  dangerColor
                                  icon="trash"
                                  confirmAction={{
                                    buttonText: 'Delete',
                                    onClick: () =>
                                      handleDeleteChurch(
                                        el.branchId,
                                        el.churchId,
                                        close
                                      ),
                                    loading: isDeletingChurch,
                                  }}
                                />
                              )}
                            </Modal>
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

      <ShowView when={!branches.length}>
        <NoDataCard
          heading="No Branch yet"
          description="Church is not live yet"
        />
      </ShowView>
    </>
  );
};

export default BranchesTable;
