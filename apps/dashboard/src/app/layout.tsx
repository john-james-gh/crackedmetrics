import {Session} from '@supabase/supabase-js';
import {useEffect, useState} from 'react';
import {NavLink, Outlet} from 'react-router';

import {TenantContext, type TenantContextType} from '../context/tenant';
import supabase from '../utils/supabase';
import {SignIn} from './sign-in';
import {SignOut} from './sign-out';

const links = [
  {
    label: 'Home',
    to: '/',
  },
  {
    label: 'Create Tenant',
    to: '/create-tenant',
  },
  {
    label: 'Create Project',
    to: '/create-project',
  },
  {
    label: 'Test Runs',
    to: '/test-runs',
  },
  {
    label: 'Create API Key',
    to: '/create-api-key',
  },
];

export function Layout() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tenant, setTenant] = useState<TenantContextType>(null);

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

  useEffect(() => {
    if (!session?.user.id) return;

    (async () => {
      const {data, error} = await supabase
        .from('memberships')
        .select('tenant:tenants(name, id, owner_id, created_at)')
        .eq('user_id', session.user.id)
        .single();

      if (error) {
        console.error(error);
        return;
      }
      setTenant(data.tenant);
    })();
  }, [session?.user.id]);

  return (
    <>
      <header className="px-6">
        <section className="flex justify-between items-center py-1">
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
        <section className="flex items-center gap-x-2 py-1">
          Hi {JSON.stringify(session?.user.user_metadata.name)} --{' '}
          <img
            src={session?.user.user_metadata.avatar_url}
            alt="Avatar"
            className="h-6 w-6 rounded-full inline-block"
          />{' '}
          -- {tenant?.name}
        </section>
        <hr />
        <nav className="flex gap-x-4 py-1">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={({isActive}) => (isActive ? 'text-blue-500' : '')}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <hr />
      </header>
      <main className="px-6 py-1">
        <TenantContext value={tenant}>
          <Outlet />
        </TenantContext>
      </main>
    </>
  );
}
