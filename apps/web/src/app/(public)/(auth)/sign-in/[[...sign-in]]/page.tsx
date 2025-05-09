import { CredentialsSignInForm } from '@/components/forms/credentials-signin-form';
import { AuthHeader } from '../../_components/auth-header';
import { AuthWrapper } from '../../_components/auth-wrapper';
import { Separator } from '@note-taking-app/ui/separator';

import { AuthRedirect } from '../../_components/auth-redirect';
import { AppPaths } from '@/shared/common/app-paths';
import { AuthLoginWithProviders } from '../../_components/auth-login-with-providers';
import { AppSignInProviders } from '@/shared/common/app-signin-providers';

export default function SignInPage() {
  return (
    <AuthWrapper>
      <AuthHeader
        title="Welcome to Note"
        description="Please log in to continue"
      />

      <div className="flex flex-col gap-y-200">
        <CredentialsSignInForm />

        <Separator />

        <AuthLoginWithProviders providers={[AppSignInProviders.Google]}>
          Or log in with:
        </AuthLoginWithProviders>

        <Separator />

        <AuthRedirect
          redirectTo={{ href: AppPaths.Register, label: 'Sign Up' }}
        >
          No account yet?
        </AuthRedirect>
      </div>
    </AuthWrapper>
  );
}
