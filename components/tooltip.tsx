import {
  Arrow,
  Portal,
  Provider,
  Root,
  Content,
  Trigger,
} from '@radix-ui/react-tooltip';
import { ReactNode } from 'react';

interface IToolTipProps {
  content: string;
  trigger: ReactNode;
}

const ToolTip = ({ content, trigger }: IToolTipProps) => {
  return (
    <Provider delayDuration={0}>
      <Root>
        <Trigger asChild>{trigger}</Trigger>
        <Portal>
          <Content
            align="end"
            sideOffset={5}
            className="rounded-md bg-gray-100 px-3 py-2 text-background shadow-lg text-sm max-w-80 z-50"
          >
            <p className="text-foreground">{content}</p>
            <Arrow className="fill-gray-300" />
          </Content>
        </Portal>
      </Root>
    </Provider>
  );
};

export default ToolTip;
