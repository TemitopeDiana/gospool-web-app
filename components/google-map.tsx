'use client';

import { HTMLAttributes } from 'react';

type GoogleMapTravelMode = 'driving' | 'walking' | 'bicycling' | 'transit';

type GoogleMapBaseProps = Omit<HTMLAttributes<HTMLIFrameElement>, 'title'> & {
  width?: string | number;
  height?: string | number;
  allowFullScreen?: boolean;
  loading?: 'eager' | 'lazy';
  title?: string;
  className?: string;
  center?: string;
  zoom?: number;
  mapType?: 'roadmap' | 'satellite';
  region?: string;
};

type GoogleMapDirectionsProps = GoogleMapBaseProps & {
  mode: 'directions';
  from: string;
  to: string;
  stops?: string[];
  travelMode?: GoogleMapTravelMode;
};

type GoogleMapPlaceProps = GoogleMapBaseProps & {
  mode?: 'place';
  query?: string;
};

type GoogleMapSearchProps = GoogleMapBaseProps & {
  mode: 'search';
  query?: string;
};

type GoogleMapViewProps = GoogleMapBaseProps & {
  mode: 'view';
};

type GoogleMapStreetViewProps = GoogleMapBaseProps & {
  mode: 'streetview';
};

type GoogleMapProps =
  | GoogleMapDirectionsProps
  | GoogleMapPlaceProps
  | GoogleMapSearchProps
  | GoogleMapViewProps
  | GoogleMapStreetViewProps;

const GoogleMap = (props: GoogleMapProps) => {
  const {
    width = '100%',
    height = 300,
    allowFullScreen = true,
    loading = 'lazy',
    title = 'Google Maps',
    className,
    center,
    zoom,
    mapType,
    region,
    ...rest
  } = props;

  const apiKey = process.env.NEXT_PUBLIC_PLACES_API_KEY;

  const params = new URLSearchParams({
    key: apiKey ?? '',
  });
  if (rest.mode === 'directions') {
    params.set('origin', rest.from);
    params.set('destination', rest.to);
    params.set('mode', rest.travelMode ?? 'driving');

    if (rest.stops?.length) {
      params.set('waypoints', rest.stops.join('|'));
    }
  }

  if (rest.mode === 'place' || rest.mode === 'search') {
    if (rest.query) {
      params.set('q', rest.query);
    }
  }

  if (center) {
    params.set('center', center);
  }

  if (zoom !== undefined) {
    params.set('zoom', String(zoom));
  }

  if (mapType) {
    params.set('maptype', mapType);
  }

  if (region) {
    params.set('region', region);
  }

  const src = `https://www.google.com/maps/embed/v1/${rest.mode}?${params.toString()}`;

  return (
    <iframe
      {...rest}
      src={src}
      width={width}
      height={height}
      className={className}
      style={{
        border: 0,
        ...rest.style,
      }}
      loading={loading}
      allowFullScreen={allowFullScreen}
      referrerPolicy="no-referrer-when-downgrade"
      title={title}
    />
  );
};

export default GoogleMap;
