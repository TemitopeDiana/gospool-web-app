import { cn } from '@/lib/utils';
import { IconName } from '@/types/icon.type';
import { FC, SVGProps } from 'react';

interface ISvgProps extends SVGProps<SVGSVGElement> {
  name: IconName;
}

const SvgIcon: FC<ISvgProps> = ({ name, className, ...props }) => {
  return (
    <svg fill="currentColor" {...props} className={cn('w-5 h-5', className)}>
      <use xlinkHref={`/assets/sprite.svg#${name}`} />
    </svg>
  );
};

export default SvgIcon;
