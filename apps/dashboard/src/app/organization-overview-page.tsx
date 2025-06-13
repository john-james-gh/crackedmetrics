import {useEffect, useState} from 'react';
import {NavLink, useParams} from 'react-router';

import type {Tables} from '@crackedmetrics/types';
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
} from '@crackedmetrics/ui';

import supabase from '../utils/supabase';

export function OrganizationOverviewPage() {
  const {organizationId} = useParams();
  const [organization, setOrganization] = useState<Tables<'projects'>[] | null>(null);
  const [projectName, setProjectName] = useState('');

  useEffect(() => {
    (async () => {
      if (!organizationId) return;

      const {data, error} = await supabase.from('projects').select('*').eq('tenant_id', organizationId);
      if (error) {
        console.error(error);
        return;
      }

      setOrganization(data);
    })();
  }, [organizationId]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!organizationId) {
      console.error('Tenant not found');
      return;
    }
    const {error: projectError} = await supabase
      .from('projects')
      .insert({name: projectName, tenant_id: organizationId});
    if (projectError) {
      console.error(projectError);
      return;
    }
  }

  return (
    <section className="flex flex-col gap-y-6">
      <h1>Organization Overview</h1>
      <hr />
      <div className="flex justify-between items-center">
        <h2 className="text-lg">Projects</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create Project</Button>
          </DialogTrigger>
          <DialogContent className="max-w-[1000px]! h-[700px]! flex flex-col gap-y-6">
            <DialogHeader>
              <DialogTitle>Create Project</DialogTitle>
              <DialogDescription>
                This is your project within Cracked Metrics. For example, you can use the name of your product
                or service.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={onSubmit} className="grid grid-rows-[1fr_auto] gap-y-6 h-full grow-1">
              <fieldset className="grid grid-cols-[1fr_2fr] gap-x-2 items-center self-start">
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  name="project-name"
                  value={projectName}
                  placeholder="My Project"
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </fieldset>
              <hr />
              <div className="flex flex-row justify-between">
                <DialogClose asChild>
                  <Button variant="outline" className="w-1/4 self-end">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" className="w-1/4 self-end">
                  Create Project
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
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
