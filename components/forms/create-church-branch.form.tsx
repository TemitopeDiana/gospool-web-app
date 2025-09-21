import React from 'react';
import Input from './Input-plain';
import { Button } from '../button';

const CreateChurchBranch = ({ close }: { close: () => void }) => {
  return (
    <form className="mt-10 flex flex-col gap-4">
      <Input label="Branch name" name="branch-name" />

      <Input label="Branch address" name="branch-address" />

      <Input label="Branch leader full name" name="branch-leader-name" />

      <Input label="Branch leader email address" name="branch-leader-email" />

      <Button
        variant="default"
        className="place-self-end xsm:px-[39.5px] py-[13.5px]"
        onClick={close}
      >
        Save Branch
      </Button>
    </form>
  );
};

export default CreateChurchBranch;
