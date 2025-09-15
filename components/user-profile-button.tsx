'use client';

import { Role, RoleLabels } from '@/types/user.type';
import Image from 'next/image';
import Popover from './popover';
import SvgIcon from './svg-icon';
import { signOut } from '@/actions/signOut';

interface Props {
  name: string;
  role: Role;
}

const UserProfileButton = ({ name, role }: Props) => {
  const handleSignOut = async () => {
    await signOut();
  };
  return (
    <Popover
      trigger={
        <button className="flex gap-3 items-center text-left">
          <div className="relative rounded-full w-9 aspect-square overflow-hidden">
            <Image
              src="/assets/user-icon.png"
              alt="profile picture"
              fill
              sizes="100%"
              className="object-contain"
            />
          </div>

          <div>
            <p className="font-medium text-a-14 capitalize">{name}</p>
            <p className="text-a-12 text-gray-500">{RoleLabels[role]}</p>
          </div>
        </button>
      }
    >
      <div className="option-menu">
        <button
          onClick={handleSignOut}
          className="hover:!bg-error-50 text-error-500"
        >
          <SvgIcon name="sign-out" />
          <span>Sign out</span>
        </button>
      </div>
    </Popover>
  );
};

export default UserProfileButton;
