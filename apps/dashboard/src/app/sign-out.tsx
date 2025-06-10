interface SignOutProps {
  onSignOut: (e: React.FormEvent) => Promise<void>;
}

export function SignOut({onSignOut}: SignOutProps) {
  return (
    <form onSubmit={onSignOut}>
      <button type="submit">Sign Out</button>
    </form>
  );
}
