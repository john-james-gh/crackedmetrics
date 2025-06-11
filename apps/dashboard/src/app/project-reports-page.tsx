import {useEffect, useState} from 'react';
import {useParams} from 'react-router';

import type {Tables} from '@crackedmetrics/types';

import supabase from '../utils/supabase';

export function ProjectReportsPage() {
  const {organizationId, projectId} = useParams();
  const [reports, setReports] = useState<Tables<'reports'>[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!organizationId) return;

    (async () => {
      setIsLoading(true);
      const query = supabase.from('reports').select('*').eq('tenant_id', organizationId);
      if (projectId) {
        query.eq('project_id', projectId);
      }
      query.order('run_at', {ascending: false});
      const {data: testRuns, error} = await query;
      if (error) {
        console.error(error);
        return;
      }
      setReports(testRuns);
      setIsLoading(false);
    })();
  }, [organizationId, projectId]);

  return (
    <section className="flex flex-col gap-y-2">
      <h1 className="text-2xl font-bold">Project Reports</h1>
      <hr />
      <div>
        {isLoading ? (
          <div>Loading...</div>
        ) : !reports || !reports.length ? (
          <div>No reports found</div>
        ) : (
          reports.map((report) => (
            <div key={report.id}>
              {report.status === 'passed' ? 'Success' : 'Failed'}--
              {new Date(report.run_at ?? '').toLocaleString()}
              <hr />
            </div>
          ))
        )}
      </div>
    </section>
  );
}
