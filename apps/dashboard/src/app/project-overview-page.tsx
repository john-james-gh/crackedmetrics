import {Eye, FileText, LayoutDashboard, TestTube, TrendingUp} from 'lucide-react';
import {useEffect, useState} from 'react';
import {NavLink, useParams} from 'react-router';

import {Button, Card, CardContent, CardFooter, CardHeader, CardTitle} from '@crackedmetrics/ui';

import logoShadow from '../assets/vitest-logo.svg';
import supabase from '../utils/supabase';

type TestToolCount = {
  test_tool: string;
  count: number;
};

export function ProjectOverviewPage() {
  const {organizationId, projectId} = useParams();
  const [reportsCount, setReportsCount] = useState<number>(0);
  const [testTools, setTestTools] = useState<TestToolCount[]>([]);
  const [passRate, setPassRate] = useState<number>(0);

  useEffect(() => {
    if (!organizationId || !projectId) return;

    (async () => {
      // Fetch total reports count
      const {count, error: countError} = await supabase
        .from('reports')
        .select('*', {count: 'exact', head: true})
        .eq('tenant_id', organizationId)
        .eq('project_id', projectId);

      if (countError) {
        console.error('Error fetching reports count:', countError);
        return;
      }

      setReportsCount(count || 0);

      // Fetch test tools and their counts
      const {data: testToolsData, error: toolsError} = await supabase
        .from('reports')
        .select('test_tool')
        .eq('tenant_id', organizationId)
        .eq('project_id', projectId);

      if (toolsError) {
        console.error('Error fetching test tools:', toolsError);
        return;
      }

      // Count occurrences of each test tool
      const toolCounts = testToolsData.reduce(
        (acc, report) => {
          const tool = report.test_tool;
          acc[tool] = (acc[tool] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

      // Convert to array format
      const toolCountArray = Object.entries(toolCounts).map(([test_tool, count]) => ({
        test_tool,
        count,
      }));

      setTestTools(toolCountArray);

      // Fetch reports for pass rate calculation
      const {data: reportsData, error: reportsError} = await supabase
        .from('reports')
        .select('status')
        .eq('tenant_id', organizationId)
        .eq('project_id', projectId);

      if (reportsError) {
        console.error('Error fetching reports for pass rate:', reportsError);
        return;
      }

      // Calculate pass rate
      const totalReports = reportsData.length;
      const passedReports = reportsData.filter((report) => report.status === 'passed').length;
      const passRatePercentage = totalReports > 0 ? (passedReports / totalReports) * 100 : 0;

      setPassRate(Math.round(passRatePercentage * 100) / 100); // Round to 2 decimal places
    })();
  }, [organizationId, projectId]);

  return (
    <section className="flex flex-col gap-y-6">
      <h1 className="text-3xl font-black flex items-center gap-x-2 underline">
        <LayoutDashboard className="size-8" />
        Project Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="flex flex-col shadow-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Total Reports</CardTitle>
            <FileText className="h-4 w-4" />
          </CardHeader>
          <CardContent className="space-y-1">
            <div>{reportsCount}</div>
            <p className="text-xs text-muted-foreground">All test reports for this project</p>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button variant="secondary" size="sm" asChild>
              <NavLink to={`/${organizationId}/${projectId}/reports`} viewTransition>
                <Eye className="size-4" />
                View
              </NavLink>
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex flex-col shadow-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Test Tools</CardTitle>
            <TestTube className="h-4 w-4" />
          </CardHeader>
          <CardContent className="space-y-1">
            <div>
              {testTools.length === 0 ? (
                <p className="text-sm text-muted-foreground">No test tools found</p>
              ) : (
                testTools.map((tool) => (
                  <div key={tool.test_tool} className="flex justify-between items-center">
                    <span className="text-sm capitalize">
                      {tool.test_tool === 'vitest' ? (
                        <div className="flex items-center gap-x-2">
                          <img src={logoShadow} alt="Vitest Logo" className="h-4 w-4" />
                          <span className="text-sm capitalize">Vitest</span>
                        </div>
                      ) : (
                        tool.test_tool
                      )}
                    </span>
                    <span className="text-sm font-medium">{tool.count}</span>
                  </div>
                ))
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {testTools.length} different test tool{testTools.length !== 1 ? 's' : ''} used
            </p>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button variant="secondary" size="sm" asChild>
              <NavLink to={`/${organizationId}/${projectId}/reports`} viewTransition>
                <Eye className="size-4" />
                View
              </NavLink>
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex flex-col shadow-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Pass Rate</CardTitle>
            <TrendingUp className="h-4 w-4" />
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-bold">{passRate}%</div>
            <p className="text-xs text-muted-foreground">
              {reportsCount > 0
                ? `${Math.round((passRate / 100) * reportsCount)} of ${reportsCount} tests passed`
                : 'No tests run yet'}
            </p>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button variant="secondary" size="sm" asChild>
              <NavLink to={`/${organizationId}/${projectId}/reports`} viewTransition>
                <Eye className="size-4" />
                View
              </NavLink>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
