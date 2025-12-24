import { useId } from 'react';
import CustomSelect, {
  ClearIndicatorProps,
  components,
  ControlProps,
  DropdownIndicatorProps,
  MenuProps,
  MultiValueProps,
  MultiValueRemoveProps,
  NoticeProps,
  OptionProps,
  PlaceholderProps,
  Props,
} from 'react-select';

import SvgIcon from '@/components/svg-icon';
import { FieldError } from 'react-hook-form';
import InputFooterText from '../input-footer-text';
import Show from '@/components/show-view';

import { cn } from '@/lib/utils';
import Popover from '../popover';

export const DropdownIndicator = (props: DropdownIndicatorProps) => {
  return (
    <components.DropdownIndicator {...props}>
      <SvgIcon name="chevron-down" className="h-5 w-5 text-a-text" />
    </components.DropdownIndicator>
  );
};

export const Placeholder = (props: PlaceholderProps) => (
  <components.Placeholder {...props} className="text-a-text/20" />
);

export const ClearIndicator = (props: ClearIndicatorProps) => {
  return (
    <components.ClearIndicator {...props}>
      <SvgIcon name="close" className="h-4 w-4" />
    </components.ClearIndicator>
  );
};
export const Control = (
  props: ControlProps & { dataTest?: string; error?: boolean }
) => {
  const { dataTest, isFocused, isDisabled, error, ...restProps } = props;

  return (
    <components.Control
      isFocused={isFocused}
      isDisabled={isDisabled}
      data-test={dataTest}
      className={cn(
        ' py-[13.5px] px-4 text-a-16 rounded-10 bg-gray-50 rounded-8 border',
        isDisabled && 'cursor-not-allowed hidden',
        error && 'border-error-300',
        isFocused && 'border-none'
      )}
      {...restProps}
    />
  );
};

export const MultiValueRemove = (props: MultiValueRemoveProps) => (
  <components.MultiValueRemove {...props}>
    <button className="bg-error-200 text-error-300 grid place-items-center rounded-full h-5 w-5">
      <SvgIcon name="close" className="h-3 w-3 flex-1 text-error-500" />
    </button>
  </components.MultiValueRemove>
);

export const MultiValue = (props: MultiValueProps) => (
  <components.MultiValue
    {...props}
    className={`px-1.25 bg-foreground py-1 rounded-10 [&>div:first-child]:text-a-text space-y-1 mr-1  [&>div:first-child]:px-1`}
  />
);

export const NoOptionsMessage = (props: NoticeProps) => (
  <components.NoOptionsMessage {...props}>
    <div className="text-a-text/50 bg-white text-sm p-3 border rounded-10">
      No options available
    </div>
  </components.NoOptionsMessage>
);

export const Menu = (props: MenuProps) => (
  <components.Menu
    {...props}
    className="bg-white rounded-10 shadow-a-base p-1 border mt-2"
  />
);

export const Option = (props: OptionProps) => {
  const { isFocused, children } = props;

  return (
    <components.Option {...props}>
      <div
        className={`
          cursor-pointer mb-1 p-px
          ${isFocused ? 'bg-primary-20' : ' text-a-text'}
        `}
      >
        <p className="p-2 hover:bg-primary-20">{children}</p>
      </div>
    </components.Option>
  );
};

export type SelectOptionType = {
  value: string;
  label: string;
  slug?: string;
};

export interface ISelectProps extends Props {
  dataTest?: string;
  footer?: string;
  error?: FieldError;
  label: string;
  required?: boolean;
  description?: string;
}

const Select = ({ required = false, description, ...props }: ISelectProps) => {
  return (
    <div className="input">
      <div className="flex items-center gap-2 mb-2.5">
        <label htmlFor={props.label} className="text-sm">
          {props.label}
          <Show when={required}>
            <span>*</span>
          </Show>
        </label>
        <Show when={!!description}>
          <Popover>
            <p>{description}</p>
          </Popover>
        </Show>
      </div>

      <CustomSelect
        {...props}
        unstyled
        components={{
          Control: (controlProps) => (
            <Control
              {...controlProps}
              data-test={props.dataTest}
              error={!!props.error}
            />
          ),
          DropdownIndicator,
          Option,
          MultiValueRemove,
          MultiValue,
          NoOptionsMessage,
          ClearIndicator,
          Placeholder,
          Menu,
        }}
        instanceId={useId()}
        menuPlacement="auto"
        inputId={props.label}
      />

      <Show when={!!props.error || !!props.footer}>
        <InputFooterText
          text={(props.error ? props.error.message : props.footer) ?? ''}
          isError={!!props.error}
        />
      </Show>
    </div>
  );
};

Select.displayName = 'Select';
export default Select;
