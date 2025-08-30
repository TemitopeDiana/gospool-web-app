import dayjs from 'dayjs';

import SvgIcon from './svg-icon';

const RideHistory = () => {
  return (
    <div className="flex gap-3 py-3">
      <div className="px-3 mt-2">
        <SvgIcon name="car" className="w-7 h-7" />
      </div>

      <div className="flex gap-4 text-gray-400">
        <div className="flex-1">
          <div className="location-info before:border-primary font-medium pb-2 isolate text-gray-800 before:mt-1 ">
            <span className="absolute w-1 left-[5px] h-full border-l-2 border-dotted top-3.5 border-primary -z-1"></span>
            <span className="line-clamp-1">Berger Bus stop</span>
          </div>
          <p className="location-info before:border-gray-900 before:mt-[2px]">
            <span className="line-clamp-1">
              24 Calvary street, Isaac Johnson drive, Victoria island, Lagos,
              Nigeria.
            </span>
          </p>
        </div>

        <p>{dayjs().format('MMM DD')}</p>
      </div>
    </div>
  );
};

export default RideHistory;
