import {Session} from '@supabase/supabase-js';
import {useEffect, useState} from 'react';
import {NavLink, Outlet, useParams} from 'react-router';

import {SignIn} from '../components/sign-in';
import {SignOut} from '../components/sign-out';
import supabase from '../utils/supabase';

export function Layout() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {organizationId, projectId} = useParams();

  async function onSignIn(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setIsLoading(true);
    const {error} = await supabase.auth.signInWithOAuth({
      provider: 'github',
    });
    if (error) {
      console.error(error);
      setIsLoading(false);
    }
  }

  async function onSignOut(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setIsLoading(true);
    const {error} = await supabase.auth.signOut();
    if (error) {
      console.error(error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setIsLoading(true);
    supabase.auth.getSession().then(({data: {session}}) => {
      setSession(session);
    });
    const {
      data: {subscription},
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="flex flex-col px-6 py-4 gap-y-4">
      <header className="flex justify-between items-center">
        <p>Cracked Metrics</p>
        {session ? (
          isLoading ? (
            <p>Loading...</p>
          ) : (
            <SignOut onSignOut={onSignOut} />
          )
        ) : isLoading ? (
          <p>Loading...</p>
        ) : (
          <SignIn onSignIn={onSignIn} />
        )}
      </header>
      <nav className="flex flex-row gap-x-3 text-sm text-gray-500">
        <NavLink to="/">Home</NavLink>
        <span>/</span>
        <NavLink to="/account" className="flex flex-row gap-x-1 items-center">
          <img
            src={session?.user.user_metadata.avatar_url}
            alt="User Avatar"
            className="w-4 h-4 rounded-full"
          />
          My Account
        </NavLink>
        {organizationId && (
          <>
            <span>/</span>
            <NavLink to={`/${organizationId}`}>My Organization</NavLink>
            {projectId && (
              <>
                <span>/</span>
                <NavLink to={`/${organizationId}/${projectId}`}>My Project</NavLink>
              </>
            )}
          </>
        )}
      </nav>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
