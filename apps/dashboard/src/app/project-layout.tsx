import {NavLink, Outlet, useParams} from 'react-router';

export function ProjectLayout() {
  const {organizationId, projectId} = useParams();
  const links = [
    {
      label: 'Overview',
      to: `/${organizationId}/${projectId}`,
    },
    {
      label: 'Reports',
      to: `/${organizationId}/${projectId}/reports`,
    },
    {
      label: 'API Keys',
      to: `/${organizationId}/${projectId}/api-keys`,
    },
    {
      label: 'Settings',
      to: `/${organizationId}/${projectId}/settings`,
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
