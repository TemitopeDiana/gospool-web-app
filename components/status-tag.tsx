import { cn } from '@/lib/utils';
import React from 'react';

interface StatusTagProps {
  warning?: boolean;
  danger?: boolean;
  gray?: boolean;
  text: string;
}

const StatusTag = ({ warning, danger, gray, text }: StatusTagProps) => {
  return (
    <span
      className={cn(
        'py-[2px] px-2 text-primary bg-primary-20 rounded-full',
        warning && 'bg-warning-50 text-warning-700',
        danger && 'bg-error-50 text-error-700',
        gray && 'bg-gray-50 text-gray-700'
      )}
    >
      {text}
    </span>
  );
};

export default StatusTag;
