import {LogIn} from 'lucide-react';

import {Button} from '@crackedmetrics/ui';

interface SignInProps {
  onSignIn: (e: React.FormEvent) => Promise<void>;
}

export function SignIn({onSignIn}: SignInProps) {
  return (
    <form onSubmit={onSignIn}>
      <Button type="submit" variant="ghost" size="sm" className="flex items-center gap-x-2">
        <LogIn className="size-4" />
        Sign in with Github
      </Button>
    </form>
  );
}
