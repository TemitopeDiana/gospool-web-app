'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/button';
import { InitialSignInState, signIn } from './action';
import Input from '@/components/forms/Input-plain';
import PasswordInput from '@/components/forms/password-input-plain';
import { routes } from '@/lib/routes';

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
    <form className="mt-8 flex flex-col gap-4" action={formAction}>
      <h1 className="text-2xl font-semibold">Login</h1>
      <div className="flex flex-col gap-5">
        <Input
          type="email"
          name="email"
          label="Email"
          placeholder="your-name@example.com"
          autoComplete="email"
          error={state.errors?.email?.[0]}
        />
        <PasswordInput
          name="password"
          label="Password"
          placeholder="******************"
          error={state.errors?.password?.[0]}
        />
      </div>
      <Button
        className="place-self-end py-[13.5px] px-[39px]"
        loading={isPending}
      >
        Login
      </Button>
    </form>
  );
};

export default SignInForm;
