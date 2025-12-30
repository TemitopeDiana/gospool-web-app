'use client';
import { ReactElement, useState } from 'react';
import { toast } from 'sonner';
import ConfirmActionCard from './confirm-action-card';
import Modal from './modal-component';
import { deleteChurchService } from '@/actions/delete-church-service.action';

interface Props {
  trigger: ReactElement;
  branchId: string;
  serviceId: string;
  name: string;
}

const DeleteChurchServiceModal = ({
  trigger,
  branchId,
  serviceId,
  name,
}: Props) => {
  const [isDeletingService, setIsDeletingService] = useState(false);

  const handleDeleteService = async (close: () => void) => {
    setIsDeletingService(true);

    try {
      const result = await deleteChurchService(branchId, serviceId);

      if (result.success) {
        toast.success(result.message);
        close();
      } else {
        toast.error(result.message);
      }
    } finally {
      setIsDeletingService(false);
    }
  };
  return (
    <Modal trigger={trigger} hideCloseButton disableOutsideClick>
      {(close) => (
        <ConfirmActionCard
          close={close}
          title={`Delete ${name ? name : 'Service'}`}
          description={`This action will delete this service. Do you want to proceed?`}
          dangerColor
          icon="trash"
          confirmAction={{
            buttonText: 'Delete',
            onClick: () => handleDeleteService(close),
            loading: isDeletingService,
          }}
        />
      )}
    </Modal>
  );
};

export default DeleteChurchServiceModal;
