'use client';

import { useActionState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/button';
import { InitialResetPasswordInState, resetPassword } from './action';
import { routes } from '@/lib/routes';
import PasswordInput from '@/components/forms/password-input-plain';
import Input from '@/components/forms/Input-plain';
import SvgIcon from '@/components/svg-icon';
import { useCountdown } from '@/hooks/useCountDown';
import { resendOtp } from '@/actions/resend-otp.action';
import ShowView from '@/components/show-view';
import { cookieStorage } from '@/utils/cookies';

const initialState: InitialResetPasswordInState = {};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

interface Props {
  email: string;
}

const RestPasswordForm = ({ email }: Props) => {
  const [state, formAction, isPending] = useActionState(
    resetPassword,
    initialState
  );
  const router = useRouter();
  const [isResending, startResendTransition] = useTransition();
  const { secondsLeft, isDisabled, restart } = useCountdown(60);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      router.replace(routes.resetPassword());
    } else if (state?.message) {
      toast.error(state.message);
    }
  }, [state, router]);

  const handleResendOtp = () => {
    startResendTransition(async () => {
      const result = await resendOtp({
        email,
        purpose: 'password_reset',
      });

      if (result.success) {
        toast.success(result.message ?? 'OTP resent successfully');
        restart();
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <form className="flex flex-col gap-5" action={formAction}>
      <div className="flex items-start gap-3 rounded-8 border border-primary/50 bg-primary/5 p-4 text-a-12">
        <SvgIcon name="email" className="mt-0.5 size-5 shrink-0 text-primary" />

        <div className="flex-1">
          <p className="text-foreground/70">
            You&apos;re resetting the password for
          </p>

          <p className="mt-1 font-bold break-all">{email}</p>

          <button
            type="button"
            className="mt-1 text-primary font-medium hover:underline"
            onClick={() => {
              cookieStorage.clear('email');
              router.replace(routes.forgotPassword());
            }}
          >
            Not this email? Use a different email address.
          </button>
        </div>
      </div>

      <div>
        <Input
          type="number"
          name="otp"
          label="OTP"
          placeholder="000000"
          autoComplete="email"
          error={state.errors?.otp?.[0]}
          defaultValue={state.values?.otp as string}
        />

        <button
          type="button"
          disabled={isDisabled || isResending}
          onClick={handleResendOtp}
          className="ml-auto block w-fit text-a-12 text-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isResending ? (
            'Resending...'
          ) : (
            <>
              <span>Resend OTP</span>

              <ShowView when={isDisabled}>
                {' '}
                in {formatTime(secondsLeft)}
              </ShowView>
            </>
          )}
        </button>
      </div>

      <PasswordInput
        name="password"
        label="Password"
        placeholder="******************"
        error={state.errors?.password?.[0]}
        defaultValue={state.values?.password as string}
      />

      <PasswordInput
        name="confirmPassword"
        label="Confirm Password"
        placeholder="******************"
        error={state.errors?.confirmPassword?.[0]}
        defaultValue={state.values?.confirmPassword as string}
      />

      <Button
        className="place-self-end py-[13.5px] px-9.75"
        loading={isPending}
      >
        Reset Password
      </Button>
    </form>
  );
};

export default RestPasswordForm;
