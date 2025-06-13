import {useState} from 'react';
import {useNavigate, useParams} from 'react-router';

import {Button, Card, CardContent, CardHeader, CardTitle, Input, Label} from '@crackedmetrics/ui';

import supabase from '../utils/supabase';

export function OrganizationCreateProjectPage() {
  const {organizationId} = useParams();
  const [projectName, setProjectName] = useState('');
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!organizationId) {
      console.error('Tenant not found');
      return;
    }
    const {data: newProject, error: projectError} = await supabase
      .from('projects')
      .insert({name: projectName, tenant_id: organizationId})
      .select('id')
      .single();
    if (projectError) {
      console.error(projectError);
      return;
    }
    if (!newProject) {
      console.error('Project not found');
      return;
    }
    navigate(`/${organizationId}/${newProject.id}`);
  }

  return (
    <section className="flex flex-col gap-y-6">
      <h1>Create Project</h1>
      <hr />
      <div className="flex justify-center">
        <Card className="flex flex-col w-xl shadow-none">
          <CardHeader>
            <CardTitle>Create Project</CardTitle>
          </CardHeader>
          <CardContent>
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
              <div className="w-full flex justify-end">
                <Button type="submit" className="w-1/4 self-end">
                  Create Project
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
