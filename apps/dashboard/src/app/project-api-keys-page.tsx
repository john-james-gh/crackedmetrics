import {useEffect, useState} from 'react';
import {useParams} from 'react-router';

import type {Tables} from '@crackedmetrics/types';
import {Input} from '@crackedmetrics/ui';

import supabase from '../utils/supabase';

export function ProjectApiKeysPage() {
  const {organizationId, projectId} = useParams();
  const [apiKeys, setApiKeys] = useState<Tables<'api_keys'>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiKeyDescription, setApiKeyDescription] = useState('');
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    if (!organizationId || !projectId) {
      return;
    }

    (async () => {
      const {data, error} = await supabase
        .from('api_keys')
        .select('*')
        .eq('tenant_id', organizationId)
        .eq('project_id', projectId);
      if (error) {
        console.error(error);
        return;
      }
      setApiKeys(data);
      setIsLoading(false);
    })();
  }, [organizationId, projectId]);

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
    <section className="flex flex-col gap-y-2">
      <h1>Project API Keys</h1>
      <hr />
      <div>
        {isLoading ? (
          <div>Loading...</div>
        ) : !apiKeys || !apiKeys.length ? (
          <div>No API keys found</div>
        ) : (
          apiKeys.map((apiKey) => (
            <div key={apiKey.id}>
              {apiKey.description} - {apiKey.key}
            </div>
          ))
        )}
      </div>
      <h2>Create API Key</h2>
      <hr />
      <form onSubmit={onSubmit}>
        <fieldset>
          <label htmlFor="api-key-description">API Key Description</label>
          <Input
            id="api-key-description"
            name="api-key-description"
            className="w-1/2"
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
