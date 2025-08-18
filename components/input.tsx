'use client';
import { RegisterOptions, useFormContext } from 'react-hook-form';

import { FC, InputHTMLAttributes } from 'react';

import ShowView from './show-view';
import SvgIcon from './svg-icon';
import InputFooterText from './input-footer-text';
import { cn } from '@/lib/utils';
import { IconName } from '@/types/icon.type';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  icon?: IconName;
  validation?: RegisterOptions;
  footerText?: string;
}

const Input: FC<InputProps> = ({
  name,
  label,
  validation,
  footerText,
  icon,
  ...props
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message;

  return (
    <div>
      <label htmlFor={name} className="text-sm">
        {label}
      </label>
      <div
        className={cn(
          'flex gap-2 items-center w-full',
          error && 'text-error-500'
        )}
      >
        {icon && <SvgIcon name={icon} className="h-5 w-5" />}
        <div
          className={`flex w-full flex-row items-center bg-gray-50 py-[13.5px] px-4 min-w-[169px] gap-4 mt-2 rounded-8`}
        >
          <input
            {...register(name, validation)}
            id={name}
            className=" outline-none bg-transparent w-full border-none placeholder:text-gray-300 text-sm md:text-base"
            {...props}
          />
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

export default Input;
