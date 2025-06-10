import {useContext, useEffect, useState} from 'react';

import type {Tables} from '@crackedmetrics/types';

import {TenantContext} from '../context/tenant';
import supabase from '../utils/supabase';

export function TestRuns() {
  const tenant = useContext(TenantContext);

  const [data, setData] = useState<Tables<'test_runs'>[] | null>(null);
  const [projects, setProjects] = useState<Tables<'projects'>[]>([]);
  const [projectId, setProjectId] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!tenant?.id) return;

    (async () => {
      setIsLoading(true);
      const query = supabase.from('test_runs').select('*').eq('tenant_id', tenant.id);
      if (projectId) {
        query.eq('project_id', projectId);
      }
      query.order('run_at', {ascending: false});
      const {data: testRuns, error} = await query;
      if (error) {
        console.error(error);
        return;
      }
      setData(testRuns);
      setIsLoading(false);
    })();
  }, [tenant?.id, projectId]);

  useEffect(() => {
    if (!tenant?.id) return;

    (async () => {
      setIsLoading(true);
      const {data: projects, error} = await supabase.from('projects').select('*').eq('tenant_id', tenant.id);
      if (error) {
        console.error(error);
        return;
      }
      setProjects(projects);
      setIsLoading(false);
    })();
  }, [tenant?.id]);

  return (
    <div>
      <h1>Test Runs Page</h1>
      <fieldset>
        <label htmlFor="project-id">Project ID</label>
        <select
          id="project-id"
          name="project-id"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
        >
          <option value="">All Projects</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </fieldset>
      <div>
        {isLoading ? (
          <div>Loading...</div>
        ) : !data || !data.length ? (
          <div>No test runs found</div>
        ) : (
          data.map((report) => (
            <div key={report.id}>
              {report.status === 'passed' ? 'Success' : 'Failed'}--
              {new Date(report.run_at ?? '').toLocaleString()}
              <hr />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
