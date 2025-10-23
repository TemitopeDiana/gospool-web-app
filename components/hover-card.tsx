import { ReactNode } from 'react';

import {
  Arrow,
  Content,
  HoverCardContentProps,
  Portal,
  Root,
  Trigger,
} from '@radix-ui/react-hover-card';

interface IPopover extends HoverCardContentProps {
  children: ReactNode;
  trigger: ReactNode;
}

const HoverCard = ({ children, trigger, ...props }: IPopover) => {
  return (
    <Root openDelay={100}>
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

export default HoverCard;
