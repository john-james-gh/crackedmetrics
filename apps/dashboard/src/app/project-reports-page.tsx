import {CheckCircle, Eye, FileText, GitBranch, Trash2, Upload, XCircle} from 'lucide-react';
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
  Label,
} from '@crackedmetrics/ui';

import logoShadow from '../assets/vitest-logo.svg';
import supabase from '../utils/supabase';

export function ProjectReportsPage() {
  const {organizationId, projectId} = useParams();
  const [reports, setReports] = useState<Tables<'reports'>[] | null>(null);

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
      <div className="grid grid-cols-1 gap-y-4">
        {!reports || !reports.length ? (
          <div>No reports found</div>
        ) : (
          reports.map((report) => (
            <Card key={report.id} className="flex flex-col shadow-none">
              <CardHeader className="flex justify-between items-center">
                <CardTitle>{report.id}</CardTitle>
                <CardDescription className="flex items-center gap-x-2">
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
              <CardContent className="flex flex-col gap-y-1">
                <p className="flex justify-between">
                  <Label>Run on</Label> {new Date(report.run_at ?? '').toLocaleString()}
                </p>
                <p className="flex justify-between">
                  <Label>Last commit</Label> {report.commit_hash}
                </p>
                <p className="flex justify-between">
                  <Label>Creator</Label>{' '}
                  {report.creator_type === 'ci' ? 'CrackedMetrics CLI' : 'Dashboard Upload'}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="destructive" size="sm">
                  <Trash2 className="size-4" />
                  Delete
                </Button>
                <Button variant="secondary" size="sm" asChild>
                  <NavLink to={`/${organizationId}/${projectId}/reports/${report.id}`} viewTransition>
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
