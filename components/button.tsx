import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';
import ShowView from './show-view';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'whitespace-nowrap rounded-full text-sm font-medium px-5 py-2 border border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/[0.5] btn focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-100 hover:bg-primary/95',
        primaryII: 'bg-primary-100 text-primary hover:bg-primary-200',
        outline:
          'bg-transparent border-gray-200 text-gray-900 hover:bg-gray-50',
        gray: 'bg-gray-200 text-white hover:bg-gray-300',
        danger: 'bg-error-200 text-white hover:bg-gray-300',
      },
      size: {
        default: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      asChild = false,
      loading = false,
      disabled,
      onClick,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size }),
          {
            'opacity-50 cursor-wait': loading,
          },
          className
        )}
        ref={ref}
        onClick={onClick}
        {...props}
        disabled={loading || disabled}
      >
        <ShowView when={loading}>
          <div className="inline-flex btn py-1 justify-center items-center text-center [&>*]:w-2 [&>*]:h-2 [&>*]:bg-current [&>*]:animate-bounce [&>*]:rounded-1/2 [&>*]:text-a-16">
            <div className="!delay-700" />
            <div className="!delay-500" />
            <div className="!delay-1000" />
          </div>
        </ShowView>

        <ShowView when={!loading}>{props.children}</ShowView>
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
