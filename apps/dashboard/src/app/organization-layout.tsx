import {NavLink, Outlet, useParams} from 'react-router';

export function OrganizationLayout() {
  const {organizationId} = useParams();
  const links = [
    {
      label: 'Overview',
      to: `/${organizationId}`,
    },
    {
      label: 'Activity',
      to: `/${organizationId}/activity`,
    },
    {
      label: 'Settings',
      to: `/${organizationId}/settings`,
    },
    {
      label: 'Members',
      to: `/${organizationId}/members`,
    },
    {
      label: 'Usage',
      to: `/${organizationId}/usage`,
    },
  ];

  return (
    <div className="flex flex-col gap-y-2">
      <nav className="flex flex-row gap-x-4">
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
      <hr />
      <div className="w-7xl mx-auto">
        <Outlet />
      </div>
    </div>
  );
}
