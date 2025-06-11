import {useEffect, useState} from 'react';
import {useParams} from 'react-router';

import type {Tables} from '@crackedmetrics/types';

import supabase from '../../utils/supabase';

export function ReportIndex() {
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
    <div>
      <h1>Reports Page</h1>
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
    </div>
  );
}
