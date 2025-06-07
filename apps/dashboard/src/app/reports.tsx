import {useEffect, useState} from 'react';

import type {Tables} from '@crackedmetrics/types';

import supabase from '../utils/supabase';

export function Reports() {
  const [reports, setReports] = useState<Tables<'test_runs'>[] | null>(null);

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
        {!reports || !reports.length ? (
          <div>No reports found</div>
        ) : (
          reports.map((report) => (
            <div key={report.id}>
              {report.status === 'passed' ? 'Success' : 'Failed'}
              {new Date(report.run_at ?? '').toLocaleString()}
              <hr />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
