import {useEffect, useState} from 'react';
import {NavLink} from 'react-router';

import {Tables} from '@crackedmetrics/types';

import supabase from '../utils/supabase';

export function AccountOverviewPage() {
  const [isLoading, setIsLoading] = useState(true);
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
    <section className="flex flex-col gap-y-2">
      <h1 className="text-2xl font-bold">Account Overview</h1>
      <hr />
      <div className="flex justify-between items-center">
        <h2 className="text-lg">Organizations</h2>
        <button className="underline">Create Organization</button>
      </div>
      {isLoading && <p>Loading...</p>}
      {organizations?.length === 0 ? (
        <p>No organizations found</p>
      ) : (
        <ul>
          {organizations?.map((organization) => (
            <li key={organization.id}>
              <NavLink to={`/${organization.id}`}>{organization.name}</NavLink>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
