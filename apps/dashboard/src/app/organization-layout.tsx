import {Activity, BarChart3, LayoutDashboard, Settings, Users} from 'lucide-react';
import {NavLink, Outlet, useParams} from 'react-router';

import {Button} from '@crackedmetrics/ui';

export function OrganizationLayout() {
  const {organizationId} = useParams();
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
      <nav className="flex flex-row gap-x-6 px-4">
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
