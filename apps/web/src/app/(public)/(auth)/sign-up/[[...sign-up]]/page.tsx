import Link from 'next/link';

import { CredentialsSignUpForm } from '@/components/forms/credentials-signup-form';
import { AuthHeader } from '../../_components/auth-header';
import { AuthWrapper } from '../../_components/auth-wrapper';
import { Separator } from '@note-taking-app/ui/separator';
import { Text } from '@note-taking-app/ui/text';
import { Button } from '@note-taking-app/ui/button';
import { GoogleIcon } from '@note-taking-app/design-system/google-icon.tsx';
import { AppPaths } from '@/shared/common/app-paths';
import { AuthRedirect } from '../../_components/auth-redirect';

export default function SignUpPage() {
  return (
    <AuthWrapper>
      <AuthHeader
        title="Create Your Account"
        description="Sign up to start organizing your notes and boost your productivity."
      />

      <div className="flex flex-col gap-y-200">
        <CredentialsSignUpForm />

        <Separator />

        <div className="w-full flex flex-col items-center gap-y-200 mt-2">
          <Text size="sm" className="text-auth-text">
            Or log in with:
          </Text>

          <Button className="w-full h-12 flex gap-x-150" variant="outline">
            <GoogleIcon />
            Google
          </Button>
        </div>

        <Separator />

        <AuthRedirect redirectTo={{ label: 'Login', href: AppPaths.Login }}>
          Already have an account?
        </AuthRedirect>
      </div>
    </AuthWrapper>
  );
}
