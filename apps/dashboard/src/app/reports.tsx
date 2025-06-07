import {useLoaderData} from 'react-router';

import {loader} from '../main';

export function Reports() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>Reports</h1>
      <div>
        {!data || !data.length ? (
          <div>No reports found</div>
        ) : (
          data.map((report) => (
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
