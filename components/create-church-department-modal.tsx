import { ReactElement } from 'react';

import Drawer from './drawer';
import CreateChurchDepartmentForm from './forms/create-department.form';

interface Props {
  trigger: ReactElement;
  branchId: string;
}

const CreateChurchDepartmentModal = ({ trigger, branchId }: Props) => {
  return (
    <Drawer
      trigger={trigger}
      title="Create Church Department"
      description="Create a new church department"
      disableEscapeDown
      disableOutsideClick
    >
      {(close) => (
        <CreateChurchDepartmentForm close={close} branchId={branchId} />
      )}
    </Drawer>
  );
};

export default CreateChurchDepartmentModal;
