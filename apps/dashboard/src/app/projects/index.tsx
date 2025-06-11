import {useEffect, useState} from 'react';
import {NavLink, useParams} from 'react-router';

import type {Tables} from '@crackedmetrics/types';

import supabase from '../../utils/supabase';

export function ProjectIndex() {
  const {organizationId} = useParams();
  const [organization, setOrganization] = useState<Tables<'projects'>[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
    <section>
      <h1>ProjectIndex</h1>
      {isLoading && <p>Loading...</p>}
      {organization?.length === 0 ? (
        <p>No projects found</p>
      ) : (
        <ul>
          {organization?.map((project) => (
            <li key={project.id}>
              <NavLink to={`/organizations/${organizationId}/projects/${project.id}`}>{project.name}</NavLink>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
