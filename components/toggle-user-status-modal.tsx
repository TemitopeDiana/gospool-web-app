'use client';

import { toggleUserStatus } from '@/actions/toggleUserStatus';
import { ReactElement, useState } from 'react';
import { toast } from 'sonner';
import ConfirmActionCard from './confirm-action-card';
import Modal from './modal-component';

interface Props {
  trigger: ReactElement;
  userId: string;
  name: string;
  isActive: boolean;
}

const ToggleUserStatus = ({ trigger, userId, name, isActive }: Props) => {
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);

  const statusLabel = isActive ? 'block' : 'unblock';

  const handlePassengerStatusToggle = async (close: () => void) => {
    setIsTogglingStatus(true);

    try {
      const result = await toggleUserStatus(userId);

      if (result.success) {
        toast.success(result.message);
        close();
      } else {
        toast.error(result.message);
      }
    } finally {
      setIsTogglingStatus(false);
    }
  };

  return (
    <Modal trigger={trigger} hideCloseButton disableOutsideClick>
      {(close) => (
        <ConfirmActionCard
          close={close}
          title={`${statusLabel} ${name ? name : 'User'}`}
          description={`Are you sure you want to ${statusLabel} this user?`}
          dangerColor={isActive}
          icon="toggle"
          confirmAction={{
            buttonText: isActive ? 'Block' : 'Unblock',
            onClick: () => handlePassengerStatusToggle(close),
            loading: isTogglingStatus,
          }}
        />
      )}
    </Modal>
  );
};

export default ToggleUserStatus;
