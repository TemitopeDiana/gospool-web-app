import AuthContainer from '@/components/auth-container';
import RestPasswordForm from './form';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { routes } from '@/lib/routes';

const ResetPasswordPage = async () => {
  const cookie = cookies();

  const email = decodeURIComponent((await cookie).get('email')?.value || '');

  if (!email) {
    redirect(routes.forgotPassword());
  }

  return (
    <AuthContainer title="Reset Password">
      <RestPasswordForm email={email} />
    </AuthContainer>
  );
};

export default ResetPasswordPage;
