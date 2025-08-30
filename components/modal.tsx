'use client';
import { ReactNode, forwardRef, useImperativeHandle, useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import {
  Content,
  DialogOverlay,
  Portal,
  Root,
  Title,
  Trigger,
  Description,
} from '@radix-ui/react-dialog';

import SvgIcon from './svg-icon';

import { cn } from '@/lib/utils';
import { IconName } from '@/types/icon.type';

interface IModalProps {
  trigger: ReactNode;
  children: ReactNode | ((close: () => void) => ReactNode);
  onClose?: () => void;
  disableEscapeDown?: boolean;
  disableOutsideClick?: boolean;
  className?: string;
  title?: string;
  iconName?: IconName;
  iconSizeClassName?: string;
  iconContainerClassName?: string;
  description?: string;
  imageURL?: StaticImageData;
  imageClassName?: string;
  maxWidthClassName?: string; // e.g. 'max-w-lg' or 'max-w-2xl'
}

export type DrawerRefActions = {
  open: () => void;
  close: () => void;
};

const Modal = forwardRef<DrawerRefActions, IModalProps>(
  (
    {
      trigger,
      children,
      onClose,
      disableEscapeDown,
      disableOutsideClick,
      className,
      title,
      iconName,
      iconSizeClassName,
      iconContainerClassName,
      description,
      imageURL,
      imageClassName,
      maxWidthClassName = 'max-w-lg',
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);

    const closeModal = () => {
      onClose?.();
      setIsOpen(false);
    };

    useImperativeHandle(ref, () => ({
      open: () => setIsOpen(true),
      close: closeModal,
    }));

    return (
      <Root open={isOpen} onOpenChange={setIsOpen}>
        <Trigger asChild className="cursor-pointer">
          {trigger}
        </Trigger>

        <Portal>
          <DialogOverlay
            className={cn(
              'fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-[#344054B2]',
              className
            )}
          >
            <Content
              onPointerDownOutside={(e) =>
                disableOutsideClick && e.preventDefault()
              }
              onEscapeKeyDown={(e) => disableEscapeDown && e.preventDefault()}
              className={cn(
                `relative w-full ${maxWidthClassName} mx-4 rounded-20 bg-background shadow-lg focus:outline-none`,

                'max-h-[90vh] overflow-auto'
              )}
            >
              <div className="px-5 py-10 md:px-10 text-center">
                {iconName && (
                  <div className={`${iconContainerClassName} mx-auto mb-6`}>
                    <SvgIcon name={iconName} className={iconSizeClassName} />
                  </div>
                )}

                {imageURL && (
                  <Image
                    src={imageURL}
                    className={`${imageClassName} mx-auto mb-6`}
                    alt="check mark"
                    priority
                  />
                )}

                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {title && (
                      <Title className="text-xl font-semibold mb-2 md:text-3xl capitalize">
                        {title}
                      </Title>
                    )}
                    {description && (
                      <Description className="text-sm text-gray-500 font-normal">
                        {description}
                      </Description>
                    )}
                  </div>
                </div>

                <div className="">
                  {typeof children === 'function'
                    ? children(closeModal)
                    : children}
                </div>
              </div>
            </Content>
          </DialogOverlay>
        </Portal>
      </Root>
    );
  }
);

Modal.displayName = 'CenteredModal';
export default Modal;
