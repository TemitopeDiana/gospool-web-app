import { Description, Title } from '@radix-ui/react-dialog';
import SvgIcon from './svg-icon';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { IconName } from '@/types/icon.type';

interface ConfirmActionCardProps {
  icon?: IconName;
  title: string;
  description: string;
  close: () => void;
  confirmAction: {
    buttonText: string;
    onClick: () => void;
    loading?: boolean;
  };
  dangerColor?: boolean;
}

const ConfirmActionCard = ({
  title,
  description,
  close,
  confirmAction,
  dangerColor = false,
  icon,
}: ConfirmActionCardProps) => {
  const handleConfirmAction = async () => {
    await confirmAction.onClick();
    close();
  };
  return (
    <div className="px-5 py-10 bg-white rounded-20 mx-auto shadow-lg focus:outline-none md:px-10 text-center max-w-[442px]">
      <div
        className={cn(
          'mx-auto aspect-square w-max h-max p-3 mb-6 bg-primary/10 rounded-full ',
          dangerColor && 'bg-error-50 text-error-700'
        )}
      >
        <SvgIcon
          name={icon ?? 'bell'}
          className="w-16 h-16 flex items-center justify-center"
        />
      </div>

      <Title className="text-xl font-semibold mb-2 md:text-2xl capitalize">
        {title}
      </Title>

      <Description className="text-sm text-gray-500 font-normal">
        {description}
      </Description>

      <div className="mt-10 flex gap-4 justify-end [&>button]:min-w-a-150">
        <Button onClick={close} variant="outline">
          Cancel
        </Button>
        <Button
          variant={dangerColor ? 'danger' : 'default'}
          onClick={handleConfirmAction}
          loading={confirmAction.loading}
        >
          {confirmAction.buttonText}
        </Button>
      </div>
    </div>
  );
};

export default ConfirmActionCard;
