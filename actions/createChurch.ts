'use server';

import { z } from 'zod';
import { apiV1 } from '@/lib/api';
import type { AxiosError } from 'axios';
import { revalidatePath } from 'next/cache';
import { routes } from '@/lib/routes';

const createChurchSchema = z.object({
  name: z.string().min(2, { message: 'Church name is required' }),
  logo: z
    .instanceof(File, { message: 'Logo is required' })
    .refine((file) => file.type === 'image/png', {
      message: 'Only PNG files are allowed',
    })
    .refine((file) => file.size <= 2 * 1024 * 1024, {
      message: 'Logo must be less than 2MB',
    })
    .optional(),
});

export type InitialCreateChurchFormState = {
  errors?: {
    name?: string[];
    total_branches?: string[];
    logo?: string[];
  };
  success?: boolean;
  error_message?: string;
};

// async function fileToBase64(file: File): Promise<string> {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result as string);
//     reader.onerror = reject;
//   });
// }

export const createChurchAction = async (
  _: InitialCreateChurchFormState,
  formData: FormData
): Promise<InitialCreateChurchFormState> => {
  const fields = Object.fromEntries(formData.entries());

  const parsedData = {
    ...fields,
    //  logo: formData.get('logo') as File,
  };

  const validatedFields = createChurchSchema.safeParse(parsedData);

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  try {
    //  const logoBase64 = await fileToBase64(validatedFields.data.logo as File);

    const payload = {
      name: validatedFields.data.name,
      // logo: logoBase64,
    };

    await apiV1.post('/churches', payload);

    revalidatePath(routes.home());
    return { success: true };
  } catch (err) {
    const axiosErr = err as AxiosError<{ message?: string }>;

    return {
      success: false,
      error_message:
        axiosErr.response?.data?.message ||
        'Failed to create church, please try again',
    };
  }
};
