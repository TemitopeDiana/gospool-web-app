import { FC } from 'react';
import Autocomplete, {
  ReactGoogleAutocompleteInputProps,
} from 'react-google-autocomplete';
import { RegisterOptions, useFormContext } from 'react-hook-form';

import ShowView from '../show-view';
import SvgIcon from '../svg-icon';
import { IconName } from '@/types/icon.type';
import { cn } from '@/lib/utils';
import InputFooterText from '../input-footer-text';

interface AddressInputProps extends ReactGoogleAutocompleteInputProps {
  name: string;
  label: string;
  validation: RegisterOptions;
  footerText?: string;
  icon?: IconName;
}

const AddressSearchInput: FC<AddressInputProps> = ({
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
    <div className="input">
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
          <Autocomplete
            {...register(name, validation)}
            apiKey={process.env.NEXT_PUBLIC_PLACES_API_KEY}
            id={name}
            options={{
              types: ['geocode', 'establishment'],
              componentRestrictions: { country: 'ng' },
            }}
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

export default AddressSearchInput;
