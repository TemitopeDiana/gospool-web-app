'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import React, { InputHTMLAttributes, useEffect, useState } from 'react';
import InputFooterText from '../input-footer-text';
import ShowView from '../show-view';
import SvgIcon from '../svg-icon';
import { useFormContext, useWatch } from 'react-hook-form';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  requiredText?: string;
  footerText?: string;
  isSecondary?: boolean;
}

const ImageUploadInput = ({
  name,
  label,
  requiredText,
  footerText,
  isSecondary = false,
  ...props
}: InputProps) => {
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  const fileList: FileList = useWatch({ control, name });

  const error = errors[name]?.message;

  useEffect(() => {
    if (fileList && fileList[0]) {
      const file = fileList[0];
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  }, [fileList]);

  return (
    <div className="input">
      <label htmlFor={name} className="text-sm">
        {label}
      </label>

      <div className="flex gap-3 items-center flex-wrap text-primary">
        <label
          htmlFor={name}
          className={cn(
            'grid place-items-center w-[100px] aspect-square rounded-10 border relative overflow-hidden border-dashed cursor-pointer',
            error && 'border-red-400 text-red-500',
            isSecondary && 'w-[150px] aspect-[4/5] bg-primary/[0.02]'
          )}
        >
          <ShowView when={!!preview}>
            <Image
              src={preview ?? ''}
              alt="Preview"
              fill
              sizes="100%"
              className="object-cover"
            />
          </ShowView>

          <ShowView when={!preview}>
            <div className="text-center text-gray-400">
              <SvgIcon name="image" className="mx-auto" />
              <ShowView when={isSecondary}>
                <p className="text-xs">Click to upload</p>
              </ShowView>
            </div>
          </ShowView>
        </label>

        <label
          htmlFor={name}
          className="px-5 py-2 flex items-center bg-primary/5 gap-3 rounded-10 cursor-pointer"
        >
          <SvgIcon name="upload" />
          <span>Upload Logo</span>
        </label>
      </div>

      <ShowView when={!!error || !!footerText}>
        <InputFooterText
          text={(error ?? footerText) as string}
          isError={!!error}
        />
      </ShowView>

      <input
        {...register(name, {
          required: requiredText ? requiredText : false,
          validate: (fileList: FileList) => {
            const file = fileList?.[0];
            if (!file) return true;

            if (file.size > 2 * 1024 * 1024) {
              return 'File size should not exceed 2 MB';
            }

            const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!validTypes.includes(file.type)) {
              return 'Only JPG and PNG images are allowed';
            }

            return true;
          },
        })}
        type="file"
        className="hidden"
        id={name}
        accept="image/png, image/jpeg, image/jpg"
        {...props}
      />
    </div>
  );
};

export default ImageUploadInput;
