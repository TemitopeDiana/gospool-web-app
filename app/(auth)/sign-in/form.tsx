'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import isEmail from 'validator/lib/isEmail';

import { Button } from '@/components/button';
import Input from '@/components/input';
import PasswordInput from '@/components/password-input';

import { routes } from '@/lib/routes';
import { SignIn } from '@/types/auth.type';
import { signIn } from './action';

const SignInForm = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<SignIn>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { handleSubmit, reset } = form;

  const onSubmit: SubmitHandler<SignIn> = (data) => {
    startTransition(async () => {
      const response = await signIn(data);

      if (response.success) {
        reset();
        toast.success('Login successful');
        router.replace(routes.home());
      } else {
        toast.error(response.message);
      }
    });
  };

  return (
    <FormProvider {...form}>
      <form
        className="mt-8 flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-2xl font-semibold">Login</h1>
        <div className="flex flex-col gap-5">
          <Input
            type="email"
            name="email"
            label="Email"
            placeholder="your-name@example.com"
            validation={{
              required: 'Please enter your email',
              validate: {
                isValidEmail: (value) =>
                  isEmail(value) || 'Please enter a valid email address',
              },
            }}
            autoComplete="email"
          />

          <PasswordInput
            name="password"
            label="Password"
            placeholder="******************"
            validation={{
              required: 'Please enter your password',
              minLength: {
                value: 5,
                message: 'Password cannot be less than 5 characters',
              },
            }}
            autoComplete="current-password"
          />
        </div>

        <Button
          className="place-self-end py-[13.5px] px-[39px]"
          loading={isPending}
        >
          Login
        </Button>
      </form>
    </FormProvider>
  );
};

export default SignInForm;
