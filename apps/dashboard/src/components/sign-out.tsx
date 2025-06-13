import {LogOut} from 'lucide-react';

import {Button} from '@crackedmetrics/ui';

interface SignOutProps {
  onSignOut: (e: React.FormEvent) => Promise<void>;
}

export function SignOut({onSignOut}: SignOutProps) {
  return (
    <form onSubmit={onSignOut}>
      <Button type="submit" variant="ghost" size="sm" className="flex items-center gap-x-2">
        <LogOut className="size-4" />
        Sign Out
      </Button>
    </form>
  );
}
