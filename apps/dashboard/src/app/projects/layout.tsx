import {NavLink, Outlet, useParams} from 'react-router';

export function ProjectLayout() {
  const {organizationId, projectId} = useParams();

  const links = [
    {
      label: 'Project',
      to: `/organizations/${organizationId}/projects/${projectId}`,
    },
    {
      label: 'Reports',
      to: `/organizations/${organizationId}/projects/${projectId}/reports`,
    },
    {
      label: 'Create Report',
      to: `/organizations/${organizationId}/projects/${projectId}/reports/create`,
    },
    {
      label: 'API Keys',
      to: `/organizations/${organizationId}/projects/${projectId}/api-keys`,
    },
    {
      label: 'Create API Key',
      to: `/organizations/${organizationId}/projects/${projectId}/api-keys/create`,
    },
  ];

  return (
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
      <Outlet />
    </div>
  );
}
