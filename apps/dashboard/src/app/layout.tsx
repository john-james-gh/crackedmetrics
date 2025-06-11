import {Session} from '@supabase/supabase-js';
import {useEffect, useState} from 'react';
import {NavLink, Outlet} from 'react-router';

import {SignIn} from '../components/sign-in';
import {SignOut} from '../components/sign-out';
import supabase from '../utils/supabase';

const links = [
  {
    label: 'Home',
    to: '/',
  },
  {
    label: 'Organizations',
    to: '/organizations',
  },
  {
    label: 'Create Organization',
    to: '/organizations/create',
  },
];

export function Layout() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
    <div className="flex flex-col px-6 gap-y-4">
      <header>
        <section className="flex justify-between items-center">
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
        </section>
        <hr />
        <section className="flex items-center gap-x-2">
          Hi {JSON.stringify(session?.user.user_metadata.name)} --{' '}
          <img
            src={session?.user.user_metadata.avatar_url}
            alt="Avatar"
            className="h-6 w-6 rounded-full inline-block"
          />
        </section>
        <hr />
      </header>
      <div className="flex flex-row gap-x-4">
        <nav className="flex flex-col w-[180px]">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end
              className={({isActive}) => (isActive ? 'text-blue-500' : '')}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
