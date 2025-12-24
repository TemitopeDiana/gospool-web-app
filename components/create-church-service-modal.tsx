import React, { ReactElement } from 'react';
import Drawer from './drawer';
import CreateChurchServiceForm from './forms/create-service-form';

interface Props {
  trigger: ReactElement;
  branchId: string;
}

const CreateChurchServiceModal = ({ trigger, branchId }: Props) => {
  return (
    <Drawer
      trigger={trigger}
      title="Create Church services"
      description="Create a new church service"
      disableEscapeDown
      disableOutsideClick
    >
      {(close) => <CreateChurchServiceForm close={close} branchId={branchId} />}
    </Drawer>
  );
};

export default CreateChurchServiceModal;
