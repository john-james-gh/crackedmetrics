import {CheckCircle, FileText, GitBranch, Upload, XCircle} from 'lucide-react';
import {useEffect, useState} from 'react';
import {NavLink, useParams} from 'react-router';

import type {Tables} from '@crackedmetrics/types';
import {Badge, Button, Card, CardDescription, CardHeader, CardTitle} from '@crackedmetrics/ui';

import logoShadow from '../assets/vitest-logo.svg';
import supabase from '../utils/supabase';

export function ProjectReportsPage() {
  const {organizationId, projectId} = useParams();
  const [reports, setReports] = useState<Tables<'reports'>[]>([]);

  useEffect(() => {
    if (!organizationId) return;

    (async () => {
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
    })();
  }, [organizationId, projectId]);

  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-x-4">
          <h1 className="text-3xl font-black flex items-center gap-x-2 underline">
            <FileText className="size-8" />
            Reports
          </h1>
        </div>
        <Button asChild>
          <NavLink to={`/${organizationId}/${projectId}/upload-report`} viewTransition>
            <Upload className="size-4" />
            Upload Report
          </NavLink>
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-y-2">
        {!reports || !reports.length ? (
          <div>No reports found</div>
        ) : (
          reports.map((report) => (
            <Card key={report.id} className="flex flex-col shadow-none py-2 cursor-pointer hover:bg-muted">
              <CardHeader className="flex justify-between items-center">
                <CardTitle>{report.id}</CardTitle>
                <CardDescription className="flex items-center gap-x-2">
                  <p>{new Date(report.run_at ?? '').toLocaleString()}</p>
                  <Badge variant="outline" className="uppercase text-xs">
                    <GitBranch className="size-3" />
                    {report.branch}
                  </Badge>
                  <Badge variant="outline" className="uppercase text-xs">
                    <img src={logoShadow} alt="Vitest Logo" className="h-4 w-4" />
                    {report.test_tool}
                  </Badge>
                  <Badge
                    className="uppercase text-xs"
                    variant={report.status === 'passed' ? 'default' : 'destructive'}
                  >
                    {report.status === 'passed' ? (
                      <CheckCircle className="size-3" />
                    ) : (
                      <XCircle className="size-3" />
                    )}
                    {report.status}
                  </Badge>
                </CardDescription>
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
