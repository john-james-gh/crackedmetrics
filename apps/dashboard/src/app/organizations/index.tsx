import {useEffect, useState} from 'react';
import {NavLink} from 'react-router';

import {Tables} from '@crackedmetrics/types';

import supabase from '../../utils/supabase';

export function OrganizationIndex() {
  const [isLoading, setIsLoading] = useState(false);
  const [organizations, setOrganizations] = useState<Tables<'tenants'>[] | null>(null);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const {
        data: {session},
      } = await supabase.auth.getSession();
      if (!session?.user.id) return;

      const {data, error} = await supabase
        .from('memberships')
        .select('tenant:tenants(id, name, owner_id, created_at)')
        .eq('user_id', session.user.id);

      if (error) {
        console.error(error);
        return;
      }

      const tenants = data.map((m) => m.tenant);
      setOrganizations(tenants);
      setIsLoading(false);
    })();
  }, []);

  return (
    <section>
      <h1>Organizations</h1>
      {isLoading && <p>Loading...</p>}
      {organizations?.length === 0 ? (
        <p>No organizations found</p>
      ) : (
        <ul>
          {organizations?.map((organization) => (
            <li key={organization.id}>
              <NavLink to={`/organizations/${organization.id}`}>{organization.name}</NavLink>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
