'use client';

import { FC, InputHTMLAttributes, useState } from 'react';

import { cn } from '@/lib/utils';
import InputFooterText from '../input-footer-text';
import ShowView from '../show-view';
import SvgIcon from '../svg-icon';

interface InputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type' | 'name' | 'autoComplete'
  > {
  name: string;
  label: string;
  footerText?: string;
  isNewPassword?: boolean;
  error?: string;
}

const PasswordInput: FC<InputProps> = ({
  name,
  label,
  footerText,
  isNewPassword,
  error,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <div
        className={cn(
          'flex gap-2 items-center w-full',
          error && 'text-error-500'
        )}
      >
        {/* <SvgIcon name="lock" className="h-4 w-4" /> */}
        <div className="flex-1 flex flex-col-reverse">
          <div className="flex bg-gray-50 py-[13.5px] min-w-[169px] px-4 mt-2 rounded-8">
            <input
              type={showPassword ? 'text' : 'password'}
              name={name}
              id={name}
              className=" outline-none bg-transparent w-full border-none"
              {...props}
              autoComplete={isNewPassword ? 'new-password' : 'current-password'}
            />

            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((prev) => !prev)}
            >
              <SvgIcon
                name={showPassword ? 'eye-off' : 'eye'}
                className="w-5 h-5"
              />
            </button>
          </div>

          <label htmlFor={name} className="text-sm">
            {label}
          </label>
        </div>
      </div>
      <ShowView when={!!error || !!footerText}>
        <InputFooterText
          text={(error ?? footerText) as string}
          isError={!!error}
        />
      </ShowView>
    </div>
  );
};

export default PasswordInput;
