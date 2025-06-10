import {useContext, useEffect, useState} from 'react';

import {Tables} from '@crackedmetrics/types';

import {TenantContext} from '../context/tenant';
import supabase from '../utils/supabase';

export function CreateApiKey() {
  const [apiKeyDescription, setApiKeyDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [projects, setProjects] = useState<Tables<'projects'>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const tenant = useContext(TenantContext);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    if (!tenant?.id) {
      console.error('Tenant not found');
      setIsLoading(false);
      return;
    }
    if (!projectId) {
      console.error('Project ID not found');
      setIsLoading(false);
      return;
    }
    const {data: newApiKey, error: apiKeyError} = await supabase
      .from('api_keys')
      .insert({
        description: apiKeyDescription,
        tenant_id: tenant.id,
        project_id: projectId,
        key: crypto.randomUUID(),
        expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
      })
      .select('key')
      .single();
    if (apiKeyError) {
      console.error(apiKeyError);
      setIsLoading(false);
      return;
    }
    setApiKey(newApiKey.key);
    setIsLoading(false);
  }

  useEffect(() => {
    if (!tenant?.id) return;

    (async () => {
      setIsLoading(true);
      const {data, error} = await supabase.from('projects').select('*').eq('tenant_id', tenant.id);
      if (error) {
        console.error(error);
        return;
      }
      setProjects(data);
      setIsLoading(false);
    })();
  }, [tenant?.id]);

  return (
    <section>
      <h1>Create API Key Page</h1>
      <form onSubmit={onSubmit}>
        <fieldset>
          <label htmlFor="project-id">Project ID</label>
          <select
            id="project-id"
            name="project-id"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          >
            <option value="">Select a project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </fieldset>
        <fieldset>
          <label htmlFor="api-key-description">API Key Description</label>
          <input
            id="api-key-description"
            name="api-key-description"
            value={apiKeyDescription}
            onChange={(e) => setApiKeyDescription(e.target.value)}
          />
        </fieldset>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create API Key'}
        </button>
      </form>
      {apiKey && <p>API Key: {apiKey}</p>}
    </section>
  );
}
