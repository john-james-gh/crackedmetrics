import {NavLink, Outlet} from 'react-router';

const links = [
  {
    label: 'Overview',
    to: '/account',
  },
  {
    label: 'Activity',
    to: '/account/activity',
  },
  {
    label: 'Settings',
    to: '/account/settings',
  },
];

export function AccountLayout() {
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
      <div>
        <Outlet />
      </div>
    </div>
  );
}
