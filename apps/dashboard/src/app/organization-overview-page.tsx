import {Eye, LayoutDashboard, Plus, Trash2} from 'lucide-react';
import {useEffect, useState} from 'react';
import {NavLink, useParams} from 'react-router';

import type {Tables} from '@crackedmetrics/types';
import {Button, Card, CardContent, CardFooter, CardHeader, CardTitle, Label} from '@crackedmetrics/ui';

import supabase from '../utils/supabase';

export function OrganizationOverviewPage() {
  const {organizationId} = useParams();
  const [projects, setProjects] = useState<Tables<'projects'>[]>([]);

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

  return (
    <section className="flex flex-col gap-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black flex items-center gap-x-2 underline">
          <LayoutDashboard className="size-8" />
          Organization Overview
        </h1>
        <Button asChild>
          <NavLink to={`/${organizationId}/create-project`} viewTransition>
            <Plus className="size-4" />
            New
          </NavLink>
        </Button>
      </div>
      {projects?.length === 0 ? (
        <p>No projects found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects?.map((project) => (
            <Card className="flex flex-col shadow-none">
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="flex justify-between">
                  <Label>Created on</Label>
                  <span>{new Date(project.created_at ?? '').toLocaleDateString()}</span>
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="destructive" size="sm">
                  <Trash2 className="size-4" />
                  Delete
                </Button>
                <Button variant="secondary" size="sm" asChild>
                  <NavLink key={project.id} to={`/${organizationId}/${project.id}`} viewTransition>
                    <Eye className="size-4" />
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
