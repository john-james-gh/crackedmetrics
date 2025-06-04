import {useEffect, useState} from 'react';

import type {VitestReport} from '@crackedmetrics/types';

import supabase from '../utils/supabase';

interface Report {
  id: string;
  raw_json: VitestReport;
  run_at: string;
}

export function Reports() {
  const [reports, setReports] = useState<Report[] | null>(null);

  async function readSupabase() {
    const {data, error} = await supabase.from('test_runs').select('*');
    if (error) {
      console.error(error);
    }
    setReports(data);
  }

  useEffect(() => {
    readSupabase();
  }, []);

  return (
    <div>
      <h1>Reports</h1>
      <button className="btn btn-outline" onClick={readSupabase}>
        Refresh
      </button>
      <div>
        {reports?.map((report) => (
          <div key={report.id}>
            {report.raw_json.success ? 'Success' : 'Failed'} {new Date(report.run_at).toLocaleString()}
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
}
