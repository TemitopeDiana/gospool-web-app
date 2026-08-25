import { cn } from '@/lib/utils';
import React from 'react';

interface StatusTagProps {
  warning?: boolean;
  danger?: boolean;
  gray?: boolean;
  success?: boolean;
  text: string;
}

const StatusTag = ({
  warning,
  danger,
  gray,
  success,
  text,
}: StatusTagProps) => {
  return (
    <span
      className={cn(
        'py-0.5 px-2 text-primary bg-primary-20 rounded-full text-xs',
        warning && 'bg-warning-50 text-warning-700',
        danger && 'bg-error-50 text-error-700',
        gray && 'bg-gray-50 text-gray-700',
        success && 'bg-green-50 text-green-700'
      )}
    >
      {text}
    </span>
  );
};

export default StatusTag;
