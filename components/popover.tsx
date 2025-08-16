import { ReactNode } from 'react';

import {
  Arrow,
  Content,
  PopoverContentProps,
  Portal,
  Root,
  Trigger,
} from '@radix-ui/react-popover';

interface IPopover extends PopoverContentProps {
  children: ReactNode;
  trigger: ReactNode;
}

const Popover = ({ children, trigger, ...props }: IPopover) => {
  return (
    <Root>
      <Trigger asChild>{trigger}</Trigger>
      <Portal>
        <Content {...props}>
          {children}
          <Arrow fill='white' stroke='#d0d5dd' strokeWidth={2} />
        </Content>
      </Portal>
    </Root>
  );
};

export default Popover;
