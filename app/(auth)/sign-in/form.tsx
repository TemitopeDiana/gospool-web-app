'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/button';
import { InitialSignInState, signIn } from './action';
import Input from '@/components/forms/Input-plain';
import PasswordInput from '@/components/forms/password-input-plain';
import { routes } from '@/lib/routes';
import Link from 'next/link';

const initialState: InitialSignInState = {};

const SignInForm = () => {
  const [state, formAction, isPending] = useActionState(signIn, initialState);
  const router = useRouter();

  useEffect(() => {
    const redirectTo =
      typeof window !== 'undefined'
        ? new URL(window.location.href).searchParams.get('redirectTo')
        : null;
    if (state?.success) {
      toast.success(state.message);
      router.push(redirectTo || routes.home());
    } else if (state?.message) {
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <form className="flex flex-col gap-4" action={formAction}>
      <Input
        type="email"
        name="email"
        label="Email"
        placeholder="your-name@example.com"
        autoComplete="email"
        error={state.errors?.email?.[0]}
        defaultValue={state.values?.email as string}
      />
      <div>
        <PasswordInput
          name="password"
          label="Password"
          placeholder="******************"
          error={state.errors?.password?.[0]}
          defaultValue={state.values?.password as string}
        />

        <small className="ml-auto block w-fit text-a-14 mt-2 disabled:cursor-not-allowed disabled:opacity-50">
          <span>Forgot password?</span>

          <Link
            href={routes.forgotPassword()}
            className="text-primary-500 hover:underline"
          >
            {' '}
            Click here
          </Link>
        </small>
      </div>
      <Button
        className="place-self-end py-[13.5px] px-9.75"
        loading={isPending}
      >
        Login
      </Button>
    </form>
  );
};

export default SignInForm;
