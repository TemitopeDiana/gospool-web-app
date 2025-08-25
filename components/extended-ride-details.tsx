import { GoogleMapsEmbed } from '@next/third-parties/google';
import dayjs from 'dayjs';
import Image from 'next/image';
import StarRating from './start-rating';

const ExtendedRideDetails = () => {
  return (
    <div>
      <div className="flex justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="relative rounded-full w-12 aspect-square overflow-hidden">
            <Image
              src="/assets/user-icon.png"
              alt="profile picture"
              fill
              sizes="100%"
              className="object-contain"
            />
          </div>

          <div className="text-a-14">
            <p className="text-a-16 md:text-a-18">Abraham</p>
            <p className="bg-gray-100 my-1 py-1 px-2 rounded w-max text-a-14 font-medium">
              ABC-1234-DE
            </p>
            <p>White Benz AMG</p>
          </div>
        </div>

        <div className="relative rounded-full w-32 aspect-video overflow-hidden">
          <Image
            src="/assets/car.png"
            alt="profile picture"
            fill
            sizes="100%"
            className="object-contain"
          />
        </div>
      </div>

      <div className="w-full rounded-xl overflow-hidden my-4 bg-gray-5-">
        <GoogleMapsEmbed
          apiKey={process.env.NEXT_PUBLIC_PLACES_API_KEY as string}
          mode="place"
          width="100%"
          height={200}
          zoom="15"
          q="Lagos"
          allowfullscreen
          style="h-full"
        />
      </div>

      <div className="text-gray-800">
        <div className="flex-1">
          <div className="location-info before:border-primary font-medium pb-2 isolate before:mt-1 ">
            <span className="absolute w-1 left-[5px] h-full border-l-2 border-dotted top-3.5 border-primary -z-1" />

            <div className="w-full">
              <small className="block text-gray-500">Leaving from</small>

              <div className="flex w-full justify-between gap-10 text-a-14">
                <span className="line-clamp-1 flex-1">Berger Bus stop</span>

                <p className="whitespace-nowrap">
                  {dayjs().format('MMM DD, hh:mm A')}
                </p>
              </div>
            </div>
          </div>
          <div className="location-info before:border-primary before:mt-[2px]">
            <div className="w-full">
              <small className="block text-gray-500">Going to</small>

              <div className="flex w-full justify-between gap-10 text-a-14">
                <span className="line-clamp-1">
                  24 Calvary street, Isaac Johnson drive, Victoria island,
                  Lagos, Nigeria.
                </span>

                <p className="whitespace-nowrap">
                  {dayjs().format('MMM DD, hh:mm A')}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p className="font font-semibold text-a-14 md:text-a-16">
              Passengers
            </p>

            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex justify-between my-3">
                <div>
                  <div className="flex items-start gap-3 py-3 ">
                    <div className="relative rounded-full w-12 aspect-square overflow-hidden">
                      <Image
                        src="/assets/user-icon.png"
                        alt="profile picture"
                        fill
                        sizes="100%"
                        className="object-contain"
                      />
                    </div>

                    <div>
                      <p className="font-medium text-a-14">Paul</p>

                      <p className="text-gray-400 mt-2 text-a-12 flex gap-[0.4ch]">
                        <span>Pickup:</span>
                        <span className="line-clamp-1 text-gray-800">{` ${'Charlie Boy'} `}</span>
                        <span>{dayjs().format('hh:mm A')}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <StarRating rating={i + 2.5} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtendedRideDetails;
