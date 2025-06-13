import {Activity, LayoutDashboard, Settings} from 'lucide-react';
import {NavLink, Outlet} from 'react-router';

import {Button} from '@crackedmetrics/ui';

const links = [
  {
    label: 'Overview',
    to: '/account',
    icon: LayoutDashboard,
  },
  {
    label: 'Activity',
    to: '/account/activity',
    icon: Activity,
  },
  {
    label: 'Settings',
    to: '/account/settings',
    icon: Settings,
  },
];

export function AccountLayout() {
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
