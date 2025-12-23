'use client';

import { cn } from '@/lib/utils';
import {
  Close,
  Content,
  DialogOverlay,
  Portal,
  Root,
  Title,
  Trigger,
  Description,
} from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ForwardedRef,
  JSX,
  ReactNode,
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';
import ShowView from './show-view';
import SvgIcon from './svg-icon';

interface IDrawerProps {
  trigger: ReactNode;
  children: ReactNode | ((close: () => void) => ReactNode);
  hideCloseButton?: boolean;
  onClose?: () => void;
  disableEscapeDown?: boolean;
  disableOutsideClick?: boolean;
  className?: string;
  title: string;
  description: string | JSX.Element;
}

export type DrawerRefActions = {
  open: () => void;
  close: () => void;
};

const Drawer = forwardRef<unknown, IDrawerProps>(
  (
    {
      trigger,
      children,
      hideCloseButton,
      onClose,
      disableEscapeDown,
      disableOutsideClick,
      className,
      title,
      description,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);

    const closeDrawer = () => {
      onClose?.();
      setIsOpen(false);
    };

    useImperativeHandle(ref, () => ({
      open: () => {
        setIsOpen(true);
      },
      close: closeDrawer,
    }));

    return (
      <Root open={isOpen} onOpenChange={setIsOpen}>
        <Trigger asChild className="cursor-pointer">
          {trigger}
        </Trigger>
        <Portal>
          <DialogOverlay
            className={cn(
              `backdrop-blur-sm bg-[#344054B2] fixed inset-0 z-50 `
            )}
          >
            <AnimatePresence>
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className={`relative ml-auto w-full max-w-[600px] border-l h-screen overflow-y-auto bg-background shadow-lg ${className}`}
              >
                <Content
                  ref={ref as ForwardedRef<HTMLDivElement>}
                  onPointerDownOutside={(e) =>
                    disableOutsideClick && e.preventDefault()
                  }
                  onEscapeKeyDown={(e) =>
                    disableEscapeDown && e.preventDefault()
                  }
                  className="h-full overflow-auto flex flex-col focus:outline-none [&>*]:p-8"
                >
                  <div className="flex justify-between gap-2 !pb-4 bg-background border-b sticky top-0 z-1">
                    <div className="flex-1  ">
                      <Title className="text-a-16 md:text-a-20 font-semibold">
                        {title}
                      </Title>
                      <Description className="text-gray-500 font-normal">
                        {description}
                      </Description>
                    </div>

                    <ShowView when={!hideCloseButton}>
                      <Close className="block  h-max w-max rounded-[50%]">
                        <SvgIcon name="close" className="w-7 h-7" />
                      </Close>
                    </ShowView>
                  </div>

                  {typeof children === 'function'
                    ? children(closeDrawer)
                    : children}
                </Content>
              </motion.div>
            </AnimatePresence>
          </DialogOverlay>
        </Portal>
      </Root>
    );
  }
);

Drawer.displayName = 'Drawer';
export default Drawer;
