import {Activity, BarChart3, LayoutDashboard, Settings, Users} from 'lucide-react';
import {useEffect} from 'react';
import {NavLink, Outlet, useNavigate, useParams} from 'react-router';

import {Button} from '@crackedmetrics/ui';

import supabase from '../utils/supabase';

export function OrganizationLayout() {
  const navigate = useNavigate();
  const {organizationId} = useParams();

  useEffect(() => {
    supabase.auth.getSession().then(({data: {session}}) => {
      if (!session) {
        navigate('/', {viewTransition: true});
      }
    });

    const {
      data: {subscription},
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/', {viewTransition: true});
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const links = [
    {
      label: 'Overview',
      to: `/${organizationId}`,
      icon: LayoutDashboard,
    },
    {
      label: 'Activity',
      to: `/${organizationId}/activity`,
      icon: Activity,
    },
    {
      label: 'Settings',
      to: `/${organizationId}/settings`,
      icon: Settings,
    },
    {
      label: 'Members',
      to: `/${organizationId}/members`,
      icon: Users,
    },
    {
      label: 'Usage',
      to: `/${organizationId}/usage`,
      icon: BarChart3,
    },
  ];

  return (
    <div className="flex flex-col gap-y-3">
      <nav className="flex flex-wrap gap-6 px-4">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink to={link.to} end key={link.to} viewTransition>
              {({isActive}) => (
                <Button variant={isActive ? 'default' : 'secondary'} className="flex items-center gap-x-1">
                  <Icon className="size-4" />
                  {link.label}
                </Button>
              )}
            </NavLink>
          );
        })}
      </nav>
      <hr />
      <div className="max-w-7xl mx-auto w-full px-4 py-4">
        <Outlet />
      </div>
    </div>
  );
}
