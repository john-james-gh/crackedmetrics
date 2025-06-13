import {Copy, Plus} from 'lucide-react';
import {useState} from 'react';
import {useParams} from 'react-router';

import {Button, Card, CardContent, CardFooter, CardHeader, CardTitle, Input, Label} from '@crackedmetrics/ui';

import supabase from '../utils/supabase';

export function ProjectApiKeysCreatePage() {
  const {organizationId, projectId} = useParams();
  const [apiKeyDescription, setApiKeyDescription] = useState('');
  const [apiKey, setApiKey] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!organizationId) {
      console.error('Tenant not found');

      return;
    }
    if (!projectId) {
      console.error('Project ID not found');
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
      return;
    }
    setApiKey(newApiKey.key);
  }

  return (
    <section className="flex flex-col gap-y-6">
      <h1>Create API Key</h1>
      <hr />
      <div className="flex justify-center">
        <Card className="flex flex-col w-xl shadow-none">
          <CardHeader>
            <CardTitle>Create API Key</CardTitle>
          </CardHeader>
          <hr />
          <CardContent>
            <form onSubmit={onSubmit} className="grid grid-rows-[1fr_auto] gap-y-6 h-full">
              <fieldset className="grid grid-cols-[1fr_2fr] gap-x-2 items-center self-start">
                <Label htmlFor="api-key-description">API Key Description</Label>
                <Input
                  id="api-key-description"
                  name="api-key-description"
                  value={apiKeyDescription}
                  onChange={(e) => setApiKeyDescription(e.target.value)}
                />
              </fieldset>
              <div className="w-full flex justify-end">
                <Button type="submit">
                  <Plus className="size-4" />
                  Create API Key
                </Button>
              </div>
            </form>
          </CardContent>
          {apiKey && (
            <>
              <hr />
              <CardFooter className="flex flex-col gap-y-6 items-start">
                <p className="flex w-full justify-between">
                  <Label>API Key</Label>
                  <span>{apiKey}</span>
                </p>
                <div className="w-full flex justify-end">
                  <Button variant="secondary" size="sm">
                    <Copy className="size-4" />
                    Copy
                  </Button>
                </div>
              </CardFooter>
            </>
          )}
        </Card>
      </div>
    </section>
  );
}
