interface SignInProps {
  onSignIn: (e: React.FormEvent) => Promise<void>;
}

export function SignIn({onSignIn}: SignInProps) {
  return (
    <form onSubmit={onSignIn}>
      <button type="submit">Sign in with Github</button>
    </form>
  );
}
