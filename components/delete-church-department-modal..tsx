'use client';
import { ReactElement, useState } from 'react';
import { toast } from 'sonner';
import ConfirmActionCard from './confirm-action-card';
import Modal from './modal-component';
import { deleteChurchDepartment } from '@/actions/delete-church-department.action';

interface Props {
  trigger: ReactElement;
  departmentId: string;
  name: string;
}

const DeleteChurchDepartmentModal = ({
  trigger,
  departmentId,
  name,
}: Props) => {
  const [isDeletingDepartment, setIsDeletingDepartment] = useState(false);

  const handleDeleteDepartment = async (close: () => void) => {
    setIsDeletingDepartment(true);

    try {
      const result = await deleteChurchDepartment(departmentId);

      if (result.success) {
        toast.success(result.message);
        close();
      } else {
        toast.error(result.message);
      }
    } finally {
      setIsDeletingDepartment(false);
    }
  };
  return (
    <Modal trigger={trigger} hideCloseButton disableOutsideClick>
      {(close) => (
        <ConfirmActionCard
          close={close}
          title={`Delete ${name ? `${name} Department` : 'Department'}`}
          description={`This action will delete this department. Do you want to proceed?`}
          dangerColor
          icon="trash"
          confirmAction={{
            buttonText: 'Delete',
            onClick: () => handleDeleteDepartment(close),
            loading: isDeletingDepartment,
          }}
        />
      )}
    </Modal>
  );
};

export default DeleteChurchDepartmentModal;
