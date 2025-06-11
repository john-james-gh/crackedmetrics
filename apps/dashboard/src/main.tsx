import * as ReactDOM from 'react-dom/client';
import {BrowserRouter, Route, Routes} from 'react-router';

import {Index} from './app/index';
import {Layout} from './app/layout';
import './styles.css';

const root = document.getElementById('root') as HTMLElement;

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Index />} />

        <Route path="account" element={<div>Account Layout</div>}>
          <Route
            index
            element={
              <h1>
                Account Overview/List of Org and Create Org Button via Modal (modal should attach path or
                search params)
              </h1>
            }
          />
          <Route path="activity" element={<h1>Account Activity</h1>} />
          <Route path="settings" element={<h1>Account Settings</h1>} />
        </Route>

        <Route path=":organizationId" element={<div>Organization Layout</div>}>
          <Route
            index
            element={
              <h1>
                Org Overview/List of Projects and Create Project Button via Modal (modal should attach path or
                search params)
              </h1>
            }
          />
          <Route path="settings" element={<h1>Organization Settings</h1>} />
          <Route path="activity" element={<h1>Organization Activity</h1>} />
          <Route path="members" element={<h1>Organization Members</h1>} />
          <Route path="usage" element={<h1>Organization Usage</h1>} />

          <Route path=":projectId" element={<div>Project Layout</div>}>
            <Route index element={<h1>Project Overview/Summary of Reports</h1>} />
            <Route path="settings" element={<h1>Project Settings</h1>} />
            <Route
              path="reports"
              element={
                <h1>
                  List Of Reports/Create Report Button via Modal (modal should attach path or search params)
                </h1>
              }
            />
            <Route path="api-keys" element={<h1>List Of API Keys/Create API Key Button via Modal</h1>} />
          </Route>
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>,
);
