import {useContext, useState} from 'react';

import {TenantContext} from '../context/tenant';
import supabase from '../utils/supabase';

export function CreateProject() {
  const tenant = useContext(TenantContext);
  const [projectName, setProjectName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    if (!tenant?.id) {
      console.error('Tenant not found');
      setIsLoading(false);
      return;
    }
    const {error: projectError} = await supabase
      .from('projects')
      .insert({name: projectName, tenant_id: tenant.id})
      .select('id')
      .single();
    if (projectError) {
      console.error(projectError);
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
  }

  return (
    <section>
      <h1>Create Project Page</h1>
      <form onSubmit={onSubmit}>
        <fieldset>
          <label htmlFor="project-name">Project Name</label>
          <input
            id="project-name"
            name="project-name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
        </fieldset>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Project'}
        </button>
      </form>
    </section>
  );
}
