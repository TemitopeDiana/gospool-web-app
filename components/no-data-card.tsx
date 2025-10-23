import Image from 'next/image';

interface Props {
  heading: string;
  description: string;
}

const NoDataCard = ({ heading, description }: Props) => {
  return (
    <div className="w-full aspect-video max-h-60 place-items-center">
      <div className="w-full max-w-a-300 my-30 mx-auto text-center">
        <Image
          src="/assets/empty-inbox.png"
          alt="empty-inbox-image"
          width={64}
          height={64}
          className="mx-auto"
        />

        <p className="font-semibold mb-2">{heading}</p>
        <p className="text-gray-500">{description}</p>
      </div>
    </div>
  );
};

export default NoDataCard;
