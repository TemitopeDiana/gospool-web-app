'use client';

import {
  Close,
  Content,
  DialogOverlay,
  Portal,
  Root,
  Trigger,
} from '@radix-ui/react-dialog';
import {
  ForwardedRef,
  ReactNode,
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';

import ShowView from './show-view';
import SvgIcon from './svg-icon';

import { cn } from '@/lib/utils';

interface IModalProps {
  trigger: ReactNode;
  children: ReactNode | ((close: () => void) => ReactNode);
  hideCloseButton?: boolean;
  onClose?: () => void;
  disableEscapeDown?: boolean;
  disableOutsideClick?: boolean;
  alignTop?: boolean;
  customClassName?: string;
}

export type ModalRefActions = {
  open: () => void;
  close: () => void;
};

const Modal = forwardRef<unknown, IModalProps>(
  (
    {
      trigger,
      children,
      hideCloseButton,
      onClose,
      disableEscapeDown,
      disableOutsideClick,
      alignTop = false,
      customClassName,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);

    const closeModal = () => {
      onClose?.();

      setIsOpen(false);
    };

    useImperativeHandle(ref, () => ({
      open: () => {
        setIsOpen(true);
      },
      close: closeModal,
    }));
    return (
      <Root open={isOpen} onOpenChange={setIsOpen}>
        <Trigger asChild>{trigger}</Trigger>
        <Portal>
          <DialogOverlay
            className={cn(
              `bg-black/40 data-[state=open]:animate-overlayShow backdrop-blur-sm fixed p-10 inset-0 ${!alignTop && 'grid place-items-center'} z-100`,
              customClassName
            )}
          >
            <Content
              ref={ref as ForwardedRef<HTMLDivElement>}
              onPointerDownOutside={(e) =>
                disableOutsideClick && e.preventDefault()
              }
              onEscapeKeyDown={(e) => disableEscapeDown && e.preventDefault()}
              className="data-[state=open]:animate-contentShow max-h-[90vh] lg:max-h-[85vh] w-full overflow-hidden max-w-[1200px] mx-auto focus:outline-none"
            >
              <ShowView when={!hideCloseButton}>
                <Close className="bg-brand-gray-50  ml-auto grid place-items-center  w-8 h-8 bg-white border-2 mb-5 text-primary  rounded-full">
                  <SvgIcon
                    name="close"
                    onClick={closeModal}
                    className="w-6 h-6"
                  />
                </Close>
              </ShowView>

              {typeof children === 'function' ? children(closeModal) : children}
            </Content>
          </DialogOverlay>
        </Portal>
      </Root>
    );
  }
);

Modal.displayName = 'Modal';
export default Modal;
