// components/star-rating.tsx
'use client';

import ShowView from './show-view';
import SvgIcon from './svg-icon';

type StarRatingProps = {
  rating: number;
  length?: number;
};

const StarRating = ({ rating, length = 5 }: StarRatingProps) => {
  // Ensure minimum rating is 1
  const safeRating = Math.max(1, Math.min(5, rating));

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(length)].map((_, i) => {
        const fullStar = i + 1 <= Math.floor(safeRating);
        const halfStar = safeRating - i > 0 && safeRating - i < 1;

        return (
          <div key={i} className="relative">
            <SvgIcon
              name="star"
              className="w-6 h-6 text-gray-200"
              fill="currentColor"
            />
            <ShowView when={fullStar}>
              <SvgIcon
                name="star"
                className="absolute top-0 left-0 w-6 h-6 text-warning-500"
                fill="currentColor"
              />
            </ShowView>
            <ShowView when={halfStar}>
              <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
                <SvgIcon
                  name="star"
                  className="w-6 h-6 text-warning-500"
                  fill="currentColor"
                />
              </div>
            </ShowView>
          </div>
        );
      })}
    </div>
  );
};

export default StarRating;
