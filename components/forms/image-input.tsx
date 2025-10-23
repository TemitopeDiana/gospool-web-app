'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import React, { InputHTMLAttributes, useState } from 'react';
import InputFooterText from '../input-footer-text';
import ShowView from '../show-view';
import SvgIcon from '../svg-icon';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  requiredText?: string;
  footerText?: string;
  isSecondary?: boolean;
  error?: string;
}

const ImageUploadInput = ({
  name,
  label,
  requiredText,
  footerText,
  isSecondary = false,
  error = '',
  ...props
}: InputProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(error);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setPreview(null);
      setFileError(requiredText || null);
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setFileError('File size should not exceed 2 MB');
      setPreview(null);
      return;
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setFileError('Only JPG and PNG images are allowed');
      setPreview(null);
      return;
    }

    // valid file
    setFileError(null);
    setPreview(URL.createObjectURL(file));
  };

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
            fileError && 'border-red-400 text-red-500',
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

      <ShowView when={!!fileError || !!footerText}>
        <InputFooterText
          text={(fileError ?? footerText) as string}
          isError={!!fileError}
        />
      </ShowView>

      <input
        id={name}
        name={name}
        type="file"
        className="hidden"
        accept="image/png, image/jpeg"
        onChange={handleFileChange}
        {...props}
      />
    </div>
  );
};

export default ImageUploadInput;
