import ForgotPasswordForm from './form';
import AuthContainer from '@/components/auth-container';

const ForgotPasswordPage = () => {
  return (
    <AuthContainer title="Forgot Password">
      <ForgotPasswordForm />
    </AuthContainer>
  );
};

export default ForgotPasswordPage;
