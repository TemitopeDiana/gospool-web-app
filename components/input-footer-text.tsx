import { cn } from '@/lib/utils';

interface InputFooterTextProps {
  text: string;
  isError?: boolean;
}

const InputFooterText = ({ text, isError }: InputFooterTextProps) => {
  return (
    <small
      className={cn(
        'text-[12px] first-letter:uppercase text-brand-gray-400',
        isError && 'text-error-500'
      )}
    >
      {text}
    </small>
  );
};

export default InputFooterText;
