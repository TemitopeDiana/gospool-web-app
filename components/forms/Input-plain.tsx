import { IconName } from '@/types/icon.type';
import { InputHTMLAttributes } from 'react';
import InputFooterText from '../input-footer-text';
import ShowView from '../show-view';
import SvgIcon from '../svg-icon';
import { cn } from '@/lib/utils';

interface InputProps
  extends InputHTMLAttributes<Omit<HTMLInputElement, 'name'>> {
  name: string;
  label: string;
  footerText?: string;
  error?: string;
  icon?: IconName;
}

const Input = ({
  name,
  label,
  footerText,
  error,
  icon,
  ...props
}: InputProps) => {
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
          className={`flex w-full flex-row items-center bg-gray-50 py-[13.5px] px-4 min-w-42.25 gap-4 mt-2 rounded-8`}
        >
          <input
            name={name}
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
