import * as ReactDOM from 'react-dom/client';
import {BrowserRouter, Route, Routes} from 'react-router';

import {AccountActivityPage} from './app/account-activity-page';
import {AccountLayout} from './app/account-layout';
import {AccountOverviewPage} from './app/account-overview-page';
import {AccountSettingsPage} from './app/account-settings-page';
import {Home} from './app/home';
import {Layout} from './app/layout';
import {OrganizationActivityPage} from './app/organization-activity-page';
import {OrganizationLayout} from './app/organization-layout';
import {OrganizationMembersPage} from './app/organization-members-page';
import {OrganizationOverviewPage} from './app/organization-overview-page';
import {OrganizationSettingsPage} from './app/organization-settings-page';
import {OrganizationUsagePage} from './app/organization-usage-page';
import {ProjectApiKeysPage} from './app/project-api-keys-page';
import {ProjectLayout} from './app/project-layout';
import {ProjectOverviewPage} from './app/project-overview-page';
import {ProjectReportsPage} from './app/project-reports-page';
import {ProjectSettingsPage} from './app/project-settings-page';
import './styles.css';

const root = document.getElementById('root') as HTMLElement;

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />

        <Route path="account" element={<AccountLayout />}>
          <Route index element={<AccountOverviewPage />} />
          <Route path="activity" element={<AccountActivityPage />} />
          <Route path="settings" element={<AccountSettingsPage />} />
        </Route>

        <Route path=":organizationId">
          <Route element={<OrganizationLayout />}>
            <Route index element={<OrganizationOverviewPage />} />
            <Route path="settings" element={<OrganizationSettingsPage />} />
            <Route path="activity" element={<OrganizationActivityPage />} />
            <Route path="members" element={<OrganizationMembersPage />} />
            <Route path="usage" element={<OrganizationUsagePage />} />
          </Route>

          <Route path=":projectId" element={<ProjectLayout />}>
            <Route index element={<ProjectOverviewPage />} />
            <Route path="settings" element={<ProjectSettingsPage />} />
            <Route path="reports" element={<ProjectReportsPage />} />
            <Route path="api-keys" element={<ProjectApiKeysPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>,
);
