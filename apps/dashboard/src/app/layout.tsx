import {Session} from '@supabase/supabase-js';
import {ChevronRight, FileText} from 'lucide-react';
import {useEffect, useState} from 'react';
import {NavLink, Outlet, useParams} from 'react-router';

import {Button} from '@crackedmetrics/ui';

import {SignIn} from '../components/sign-in';
import {SignOut} from '../components/sign-out';
import supabase from '../utils/supabase';

export function Layout() {
  const [session, setSession] = useState<Session | null>(null);
  const {organizationId, projectId} = useParams();

  async function onSignIn(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    const {error} = await supabase.auth.signInWithOAuth({
      provider: 'github',
    });
    if (error) {
      console.error(error);
    }
  }

  async function onSignOut(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    const {error} = await supabase.auth.signOut();
    if (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({data: {session}}) => {
      setSession(session);
    });
    const {
      data: {subscription},
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="flex flex-col gap-y-12">
      <header className="flex flex-col md:items-center border-b p-2 md:flex-row md:justify-between">
        <nav className="flex flex-row">
          <div className="flex gap-x-2 items-center flex-wrap">
            <Button variant="ghost" size="sm" asChild>
              <NavLink to="/" viewTransition>
                Cracked Metrics
              </NavLink>
            </Button>
            {session && (
              <>
                <ChevronRight className="size-4" />
                <Button variant="ghost" size="sm" asChild>
                  <NavLink to="/account" className="flex flex-row gap-x-1 items-center" viewTransition>
                    My Account
                  </NavLink>
                </Button>
                {organizationId && (
                  <>
                    <ChevronRight className="size-4" />
                    <Button variant="ghost" size="sm" asChild>
                      <NavLink to={`/${organizationId}`} viewTransition>
                        My Organization
                      </NavLink>
                    </Button>
                    {projectId && (
                      <>
                        <ChevronRight className="size-4" />
                        <Button variant="ghost" size="sm" asChild>
                          <NavLink to={`/${organizationId}/${projectId}`}>My Project</NavLink>
                        </Button>
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </nav>
        <nav className="flex flex-row gap-x-4 items-center">
          <Button variant="ghost" size="sm" asChild className="flex items-center gap-x-2">
            <NavLink to="/docs">
              <FileText className="size-4" />
              Docs
            </NavLink>
          </Button>
          {session ? <SignOut onSignOut={onSignOut} /> : <SignIn onSignIn={onSignIn} />}
        </nav>
      </header>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
