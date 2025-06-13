import {useEffect, useState} from 'react';
import {NavLink, useParams} from 'react-router';

import type {Tables} from '@crackedmetrics/types';
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
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
  const [projects, setProjects] = useState<Tables<'projects'>[] | null>(null);
  const [projectName, setProjectName] = useState('');

  useEffect(() => {
    (async () => {
      if (!organizationId) return;

      const {data, error} = await supabase.from('projects').select('*').eq('tenant_id', organizationId);
      if (error) {
        console.error(error);
        return;
      }

      setProjects(data);
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
        <Button asChild>
          <NavLink to={`/${organizationId}/create-project`}>Create Project</NavLink>
        </Button>
      </div>
      {projects?.length === 0 ? (
        <p>No projects found</p>
      ) : (
        <div className="flex gap-4">
          {projects?.map((project) => (
            <Card className="flex flex-col w-sm shadow-none">
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  <span>Created:</span> {new Date(project.created_at ?? '').toLocaleDateString()}
                </p>
                <p>
                  <span>Organization ID:</span> {project.tenant_id}
                </p>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="secondary" asChild>
                  <NavLink key={project.id} to={`/${organizationId}/${project.id}`}>
                    View
                  </NavLink>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
