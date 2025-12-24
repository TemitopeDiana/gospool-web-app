import { ReactNode } from 'react';

import {
  Arrow,
  Content,
  PopoverContentProps,
  Portal,
  Root,
  Trigger,
} from '@radix-ui/react-popover';
import SvgIcon from './svg-icon';

interface IPopover extends PopoverContentProps {
  children: ReactNode;
  trigger?: ReactNode;
}

const Popover = ({
  children,
  trigger = <SvgIcon name="info" className="w-4 h-4" />,
  ...props
}: IPopover) => {
  return (
    <Root>
      <Trigger asChild>{trigger}</Trigger>
      <Portal>
        <Content {...props} className="z-50">
          {children}
          <Arrow fill="white" stroke="#d0d5dd" strokeWidth={2} />
        </Content>
      </Portal>
    </Root>
  );
};

export default Popover;
