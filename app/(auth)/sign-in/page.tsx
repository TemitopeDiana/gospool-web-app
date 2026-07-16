import { Metadata } from 'next';
import SignInForm from './form';
import AuthContainer from '@/components/auth-container';

export const metadata: Metadata = {
  title: 'Sign in',
};

const SignInPage = () => {
  return (
    <AuthContainer title="Login">
      <SignInForm />

      <div className="mt-8 text-center text-sm text-gray-500">
        By logging in, you agree to our{' '}
        <a
          href="/privacy-policy"
          className="text-primary hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Privacy Policy
        </a>
      </div>
    </AuthContainer>
  );
};

export default SignInPage;
