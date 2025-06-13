import {FileText, Key, LayoutDashboard, Settings} from 'lucide-react';
import {NavLink, Outlet, useParams} from 'react-router';

import {Button} from '@crackedmetrics/ui';

export function ProjectLayout() {
  const {organizationId, projectId} = useParams();
  const links = [
    {
      label: 'Overview',
      to: `/${organizationId}/${projectId}`,
      icon: LayoutDashboard,
    },
    {
      label: 'Reports',
      to: `/${organizationId}/${projectId}/reports`,
      icon: FileText,
    },
    {
      label: 'API Keys',
      to: `/${organizationId}/${projectId}/api-keys`,
      icon: Key,
    },
    {
      label: 'Settings',
      to: `/${organizationId}/${projectId}/settings`,
      icon: Settings,
    },
  ];

  return (
    <div className="flex flex-col gap-y-4">
      <nav className="flex flex-row gap-x-4 px-4">
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
