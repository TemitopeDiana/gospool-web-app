'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/button';
import { InitialForgetPasswordInState, forgotPassword } from './action';
import Input from '@/components/forms/Input-plain';
import { routes } from '@/lib/routes';

const initialState: InitialForgetPasswordInState = {};

const ForgotPasswordForm = () => {
  const [state, formAction, isPending] = useActionState(
    forgotPassword,
    initialState
  );
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      router.replace(routes.resetPassword());
    } else if (state?.message) {
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <form className="flex flex-col gap-5" action={formAction}>
      <Input
        type="email"
        name="email"
        label="Email"
        placeholder="your-name@example.com"
        autoComplete="email"
        error={state.errors?.email?.[0]}
        defaultValue={state.values?.email as string}
      />

      <Button
        className="place-self-end py-[13.5px] px-9.75"
        loading={isPending}
      >
        Request OTP
      </Button>
    </form>
  );
};

export default ForgotPasswordForm;
