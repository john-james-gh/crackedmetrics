import {Session} from '@supabase/supabase-js';
import {useEffect, useState} from 'react';
import * as ReactDOM from 'react-dom/client';
import {Link, Outlet, RouterProvider, createBrowserRouter, redirect, useNavigation} from 'react-router';

import {LogIn} from './app/log-in';
import {Reports} from './app/reports';
import supabase from './utils/supabase';

function Root() {
  const navigation = useNavigation();
  const isNavigating = Boolean(navigation.location);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({data: {session}}) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: {subscription},
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signOut() {
    const {error} = await supabase.auth.signOut();
    if (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <h1>Cracked Metrics</h1>
      <hr />
      <nav>
        <ul>
          <li>
            <Link to="/" viewTransition>
              Home
            </Link>
          </li>
          {session ? (
            <>
              <li>
                <Link to="/dashboard/reports" viewTransition>
                  Reports
                </Link>
              </li>
              <li>
                <button onClick={signOut}>Sign Out</button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/auth/login">Log In</Link>
            </li>
          )}
        </ul>
        <hr />
      </nav>
      {isNavigating && <p>Loading...</p>}
      <Outlet />
    </div>
  );
}

function Home() {
  return <h1>Home</h1>;
}

function About() {
  return <h1>About</h1>;
}

function AuthLayout() {
  return <Outlet />;
}

function ReportDetail() {
  return <h1>Report Detail</h1>;
}

function ReportsTrending() {
  return <h1>Reports Trending</h1>;
}

function DashboardLayout() {
  return <Outlet />;
}

function DashboardHome() {
  return <h1>Dashboard Home</h1>;
}

export const loader = async () => {
  const {data, error} = await supabase.from('test_runs').select('*');
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    HydrateFallback: () => null,
    children: [
      {index: true, Component: Home},
      {path: 'about', Component: About},
      {
        path: 'auth',
        Component: AuthLayout,
        children: [{path: 'login', Component: LogIn}],
      },
      {
        path: 'dashboard',
        Component: DashboardLayout,
        loader: async () => {
          const {
            data: {session},
          } = await supabase.auth.getSession();
          if (!session) {
            return redirect('/auth/login');
          }
          return null;
        },
        children: [
          {
            index: true,
            Component: DashboardHome,
          },
          {
            path: 'reports',
            children: [
              {
                index: true,
                Component: Reports,
                loader,
              },
              {path: ':id', Component: ReportDetail},
              {path: 'trending', Component: ReportsTrending},
            ],
          },
        ],
      },
    ],
  },
]);

const root = document.getElementById('root') as HTMLElement;

ReactDOM.createRoot(root).render(<RouterProvider router={router} />);
