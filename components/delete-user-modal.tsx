'use client';
import { deleteUser } from '@/actions/deleteUser';
import { ReactElement, useState } from 'react';
import { toast } from 'sonner';
import ConfirmActionCard from './confirm-action-card';
import Modal from './modal-component';

interface Props {
  trigger: ReactElement;
  userId: string;
  name: string;
}

const DeleteUserModal = ({ trigger, userId, name }: Props) => {
  const [isDeletingUser, setIsDeletingUser] = useState(false);

  const handleDeleteUser = async (close: () => void) => {
    setIsDeletingUser(true);

    try {
      const result = await deleteUser(userId);

      if (result.success) {
        toast.success(result.message);
        close();
      } else {
        toast.error(result.message);
      }
    } finally {
      setIsDeletingUser(false);
    }
  };
  return (
    <Modal trigger={trigger} hideCloseButton disableOutsideClick>
      {(close) => (
        <ConfirmActionCard
          close={close}
          title={`Delete ${name ? name : 'User'}`}
          description={`This action will delete this user. Do you want to proceed?`}
          dangerColor
          icon="trash"
          confirmAction={{
            buttonText: 'Delete',
            onClick: () => handleDeleteUser(close),
            loading: isDeletingUser,
          }}
        />
      )}
    </Modal>
  );
};

export default DeleteUserModal;
