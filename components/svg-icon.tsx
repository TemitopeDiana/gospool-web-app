import { IconName } from '@/types/icon.type';
import { FC, SVGProps } from 'react';

interface ISvgProps extends SVGProps<SVGSVGElement> {
  name: IconName;
}

const SvgIcon: FC<ISvgProps> = ({ name, ...props }) => {
  return (
    <svg fill="currentColor" {...props}>
      <use xlinkHref={`/sprite.svg#${name}`} />
    </svg>
  );
};

export default SvgIcon;
