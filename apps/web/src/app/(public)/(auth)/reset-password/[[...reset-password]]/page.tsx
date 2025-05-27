import { ResetPasswordForm } from '@/components/forms/reset-password-form';
import { AuthHeader } from '../../_components/auth-header';
import { AuthWrapper } from '../../_components/auth-wrapper';

export default function ResetPasswordPage() {
  return (
    <AuthWrapper>
      <AuthHeader
        title="Reset Your Password"
        description="Choose a new password to secure your account."
      />

      <div className="flex flex-col gap-y-200">
        <ResetPasswordForm />
      </div>
    </AuthWrapper>
  );
}
