import { useId } from 'react';
import { NoticeProps, components } from 'react-select';
import CustomCreatableSelect from 'react-select/creatable';

import InputFooterText from '../input-footer-text';
import Show from '@/components/show-view';
import {
  ClearIndicator,
  Control,
  DropdownIndicator,
  ISelectProps,
  Menu,
  MultiValue,
  MultiValueRemove,
  Option,
  Placeholder,
} from './select';
import Popover from '../popover';

const NoOptionsMessage = (props: NoticeProps) => (
  <components.NoOptionsMessage {...props}>
    <div className="text-sm p-2 border">
      No options available?. Please add your own.
    </div>
  </components.NoOptionsMessage>
);

const CreatableSelect = ({
  required = false,
  description,
  ...props
}: ISelectProps) => {
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
      <CustomCreatableSelect
        {...props}
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
          MultiValue,
          MultiValueRemove,
          NoOptionsMessage,
          ClearIndicator,
          Placeholder,
          Menu,
        }}
        unstyled
        instanceId={useId()}
        menuPlacement="auto"
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

CreatableSelect.displayName = 'CreatableSelect';
export default CreatableSelect;
