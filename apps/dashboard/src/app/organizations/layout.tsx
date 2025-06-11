import {NavLink, Outlet, useParams} from 'react-router';

export function OrganizationLayout() {
  const {organizationId} = useParams();

  const links = [
    {
      label: 'Organization',
      to: `/organizations/${organizationId}`,
    },
    {
      label: 'Projects',
      to: `/organizations/${organizationId}/projects`,
    },
    {
      label: 'Create Project',
      to: `/organizations/${organizationId}/projects/create`,
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
