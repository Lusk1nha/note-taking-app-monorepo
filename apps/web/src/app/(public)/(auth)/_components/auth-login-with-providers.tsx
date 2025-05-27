import { RedirectToGoogleSigninAction } from '@/components/actions/redirect-to-google-signin-action';
import { appSignInComponentsMap, AppSignInProviders } from '@/shared/common/app-signin-providers';
import { Text } from '@note-taking-app/ui/text';

interface AuthLoginWithProvidersProps {
  children: string;
  providers: AppSignInProviders[];
}

export function AuthLoginWithProviders(props: Readonly<AuthLoginWithProvidersProps>) {
  const { children, providers } = props;

  return (
    <div className="w-full flex flex-col items-center gap-y-200 mt-2">
      <Text size="sm" className="text-auth-text">
        {children}
      </Text>

      {providers.map((provider) => {
        const providerComponent = appSignInComponentsMap[provider];

        if (!providerComponent) return null;

        const ProviderComponent = providerComponent.component;

        return (
          <div key={providerComponent.label} className="w-full">
            <ProviderComponent />
          </div>
        );
      })}
    </div>
  );
}
