import {CheckCircle, Eye, Plus, Trash2, XCircle} from 'lucide-react';
import {useEffect, useState} from 'react';
import {NavLink, useParams} from 'react-router';

import type {Tables} from '@crackedmetrics/types';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@crackedmetrics/ui';

import supabase from '../utils/supabase';

export function ProjectApiKeysPage() {
  const {organizationId, projectId} = useParams();
  const [apiKeys, setApiKeys] = useState<Tables<'api_keys'>[]>([]);

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
    })();
  }, [organizationId, projectId]);

  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black underline">API Keys</h1>
        <Button asChild>
          <NavLink to={`/${organizationId}/${projectId}/create-api-key`}>
            <Plus className="size-4" />
            Create API Key
          </NavLink>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {!apiKeys || !apiKeys.length ? (
          <div>No API keys found</div>
        ) : (
          apiKeys.map((apiKey) => (
            <Card key={apiKey.id} className="flex flex-col shadow-none">
              <CardHeader className="flex justify-between items-center">
                <CardTitle>{apiKey.description}</CardTitle>
                <CardDescription>
                  <Badge
                    variant={apiKey.status === 'active' ? 'default' : 'secondary'}
                    className="uppercase text-xs"
                  >
                    {apiKey.status === 'active' ? (
                      <CheckCircle className="size-3" />
                    ) : (
                      <XCircle className="size-3" />
                    )}
                    {apiKey.status}
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="flex justify-between">
                  <span>Created on:</span> {new Date(apiKey.created_at ?? '').toLocaleDateString()}
                </p>
                <p className="flex justify-between">
                  <span>Expires on:</span> {new Date(apiKey.expires_at ?? '').toLocaleDateString()}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="destructive" size="sm">
                  <Trash2 className="size-4" />
                  Delete
                </Button>
                <Button variant="secondary" size="sm" asChild>
                  <NavLink to={`/${organizationId}/${projectId}/api-keys/${apiKey.id}`}>
                    <Eye className="size-4" />
                    View
                  </NavLink>
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
