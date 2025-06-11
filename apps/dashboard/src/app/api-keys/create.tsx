import {useState} from 'react';
import {useParams} from 'react-router';

import supabase from '../../utils/supabase';

export function ApiKeyCreate() {
  const {organizationId, projectId} = useParams();
  const [apiKeyDescription, setApiKeyDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    if (!organizationId) {
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
        tenant_id: organizationId,
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

  return (
    <section>
      <h1>Create API Key Page</h1>
      <form onSubmit={onSubmit}>
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
