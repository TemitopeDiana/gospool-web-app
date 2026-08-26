import { cn } from '@/lib/utils';
import Image from 'next/image';

interface Props {
  src?: string;
  className?: string;
  alt?: string;
}
const Avatar = ({
  alt = 'avatar',
  src = '/assets/user-icon.png',
  className,
}: Props) => {
  return (
    <div
      className={cn('relative size-8 rounded-full overflow-hidden', className)}
    >
      <Image src={src} alt={alt} fill sizes="100%" className="object-cover" />
    </div>
  );
};

export default Avatar;
