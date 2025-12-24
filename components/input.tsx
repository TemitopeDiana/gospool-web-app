'use client';

import { FC, InputHTMLAttributes } from 'react';
import { RegisterOptions, useFormContext } from 'react-hook-form';

import InputFooterText from './input-footer-text';
import Popover from './popover';
import ShowView from './show-view';
import SvgIcon from './svg-icon';

import { cn } from '@/lib/utils';
import { type IconName } from '@/types/icon.type';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  icon?: IconName;
  validation?: RegisterOptions;
  footerText?: string;
  description?: string;
}

const Input: FC<InputProps> = ({
  name,
  label,
  validation,
  footerText,
  icon,
  description,
  ...props
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message;

  return (
    <div>
      <div className="flex gap-2 text-sm">
        <label htmlFor={name} className="text-sm">
          {label}
        </label>
        <ShowView when={!!description}>
          <Popover trigger={<SvgIcon name="info" className="h-4 w-4" />}>
            <p className="tooltip-content">{description}</p>
          </Popover>
        </ShowView>
      </div>
      <div
        className={cn(
          'flex gap-2 items-center w-full',
          error && 'text-error-500'
        )}
      >
        {icon && <SvgIcon name={icon} className="h-5 w-5" />}
        <div
          className={`flex w-full flex-row items-center bg-gray-50 py-[13.5px] px-4 min-w-42.25 gap-4 mt-2 rounded-8`}
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
