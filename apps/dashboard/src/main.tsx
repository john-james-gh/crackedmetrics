import * as ReactDOM from 'react-dom/client';
import {BrowserRouter, Route, Routes} from 'react-router';

import {ApiKeyIndex} from './app/api-keys';
import {ApiKeyCreate} from './app/api-keys/create';
import {ApiKeyView} from './app/api-keys/view';
import {Index} from './app/index';
import {Layout} from './app/layout';
import {OrganizationIndex} from './app/organizations';
import {OrganizationCreate} from './app/organizations/create';
import {OrganizationLayout} from './app/organizations/layout';
import {OrganizationView} from './app/organizations/view';
import {ProjectIndex} from './app/projects';
import {ProjectCreate} from './app/projects/create';
import {ProjectLayout} from './app/projects/layout';
import {ProjectView} from './app/projects/view';
import {ReportCreate} from './app/reports/create';
import {ReportIndex} from './app/reports/index';
import {ReportView} from './app/reports/view';
import './styles.css';

const root = document.getElementById('root') as HTMLElement;

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Index />} />

        <Route path="organizations">
          <Route index element={<OrganizationIndex />} />
          <Route path="create" element={<OrganizationCreate />} />

          <Route path=":organizationId" element={<OrganizationLayout />}>
            <Route index element={<OrganizationView />} />

            <Route path="projects">
              <Route index element={<ProjectIndex />} />
              <Route path="create" element={<ProjectCreate />} />

              <Route path=":projectId" element={<ProjectLayout />}>
                <Route index element={<ProjectView />} />

                <Route path="reports">
                  <Route index element={<ReportIndex />} />
                  <Route path="create" element={<ReportCreate />} />
                  <Route path=":reportId" element={<ReportView />} />
                </Route>

                <Route path="api-keys">
                  <Route index element={<ApiKeyIndex />} />
                  <Route path="create" element={<ApiKeyCreate />} />
                  <Route path=":apiKeyId" element={<ApiKeyView />} />
                </Route>
              </Route>
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>,
);
