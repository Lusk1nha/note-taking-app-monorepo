import { GoogleIcon } from '@note-taking-app/design-system/google-icon.tsx';
import { Button } from '@note-taking-app/ui/button';

export function RedirectToGoogleSigninAction() {
  return (
    <Button className="w-full h-12 flex gap-x-150" variant="outline">
      <GoogleIcon />
      Google
    </Button>
  );
}
