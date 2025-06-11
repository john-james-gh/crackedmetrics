import {useEffect, useState} from 'react';
import {NavLink, useParams} from 'react-router';

import type {Tables} from '@crackedmetrics/types';

import supabase from '../utils/supabase';

export function OrganizationOverviewPage() {
  const {organizationId} = useParams();
  const [organization, setOrganization] = useState<Tables<'projects'>[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      if (!organizationId) return;

      const {data, error} = await supabase.from('projects').select('*').eq('tenant_id', organizationId);
      if (error) {
        console.error(error);
        return;
      }

      setOrganization(data);
      setIsLoading(false);
    })();
  }, [organizationId]);

  return (
    <section className="flex flex-col gap-y-2">
      <h1 className="text-2xl font-bold">Organization Overview</h1>
      <hr />
      <div className="flex justify-between items-center">
        <h2 className="text-lg">Projects</h2>
        <button className="underline">Create Project</button>
      </div>
      {isLoading && <p>Loading...</p>}
      {organization?.length === 0 ? (
        <p>No projects found</p>
      ) : (
        <ul>
          {organization?.map((project) => (
            <li key={project.id}>
              <NavLink to={`/${organizationId}/${project.id}`}>{project.name}</NavLink>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
