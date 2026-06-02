'use client';

import React from 'react';
import Autocomplete from 'react-google-autocomplete';

interface LocationInputProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function LocationInput({
  value,
  onChange,
  placeholder = 'Type to search location...',
  className = 'w-full bg-gray-50 py-[13.5px] px-4 rounded-8 outline-none text-sm border-none placeholder:text-gray-300',
}: LocationInputProps) {
  return (
    <Autocomplete
      defaultValue={value}
      apiKey={process.env.NEXT_PUBLIC_PLACES_API_KEY}
      options={{
        types: ['geocode', 'establishment'],
        componentRestrictions: { country: 'ng' },
        fields: ['formatted_address', 'name'],
      }}
      onPlaceSelected={(place) => {
        // Guard: place or its properties may be undefined in some API responses
        if (!place) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const p = place as any;
        const label: string =
          (typeof p.formatted_address === 'string' && p.formatted_address) ||
          (typeof p.name === 'string' && p.name) ||
          '';
        onChange(label);
      }}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        onChange(e.target.value)
      }
      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') e.preventDefault();
      }}
      placeholder={placeholder}
      className={className}
    />
  );
}
