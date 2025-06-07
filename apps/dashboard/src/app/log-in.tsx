import {useState} from 'react';

import supabase from '../utils/supabase';

export function LogIn() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSocialLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const {error} = await supabase.auth.signInWithOAuth({
      provider: 'github',
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="card-title">Welcome!</h2>
      <p className="card-subtitle">Sign in to your account to continue</p>
      <form onSubmit={handleSocialLogin}>
        {error && <p className="text-sm text-destructive-500">{error}</p>}
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Continue with Github'}
        </button>
      </form>
    </div>
  );
}
