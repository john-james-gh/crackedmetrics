import {useEffect, useState} from 'react';
import {NavLink, useParams} from 'react-router';

import type {Tables} from '@crackedmetrics/types';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
} from '@crackedmetrics/ui';

import supabase from '../utils/supabase';

export function OrganizationOverviewPage() {
  const {organizationId} = useParams();
  const [organization, setOrganization] = useState<Tables<'projects'>[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [projectName, setProjectName] = useState('');
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

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    if (!organizationId) {
      console.error('Tenant not found');
      setIsLoading(false);
      return;
    }
    const {error: projectError} = await supabase
      .from('projects')
      .insert({name: projectName, tenant_id: organizationId});
    if (projectError) {
      console.error(projectError);
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
  }

  return (
    <section className="flex flex-col gap-y-6">
      <h1 className="text-2xl font-bold">Organization Overview</h1>
      <hr />
      <div className="flex justify-between items-center">
        <h2 className="text-lg">Projects</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create Project</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Project</DialogTitle>
            </DialogHeader>
            <form onSubmit={onSubmit} className="flex flex-col gap-y-4">
              <label htmlFor="project-name">Project Name</label>
              <Input
                id="project-name"
                name="project-name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Project'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
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
