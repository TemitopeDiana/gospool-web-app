import Image from 'next/image';
import { ReactNode } from 'react';

interface Props {
  heading: string;
  description: string;
  children?: ReactNode;
}

const NoDataCard = ({ heading, description, children }: Props) => {
  return (
    <div className="w-full aspect-video max-h-a-300 place-items-center">
      <div className="w-full max-w-a-400 my-30 mx-auto text-center">
        <Image
          src="/assets/empty-inbox.png"
          alt="empty-inbox-image"
          width={64}
          height={64}
          className="mx-auto"
        />

        <p className="font-semibold mb-2">{heading}</p>
        <p className="text-gray-500">{description}</p>
        {children}
      </div>
    </div>
  );
};

export default NoDataCard;
