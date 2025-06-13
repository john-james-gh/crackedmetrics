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
    <div className="flex flex-col gap-y-4">
      <header className="flex justify-between items-center border-b border-gray-200 px-4 py-2">
        <nav className="flex flex-row">
          <div className="flex flex-row gap-x-4 items-center">
            <NavLink to="/">Cracked Metrics</NavLink>
            {session && (
              <>
                <span>/</span>
                <NavLink to="/account" className="flex flex-row gap-x-1 items-center">
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
              </>
            )}
          </div>
        </nav>
        <nav className="flex flex-row gap-x-4 items-center">
          <NavLink to="/docs">Docs</NavLink>
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
        </nav>
      </header>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
