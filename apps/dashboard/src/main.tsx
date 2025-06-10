import * as ReactDOM from 'react-dom/client';
import {BrowserRouter, Route, Routes} from 'react-router';

import {CreateApiKey} from './app/create-api-key';
import {CreateProject} from './app/create-project';
import {CreateTenant} from './app/create-tenant';
import {Home} from './app/home';
import {Layout} from './app/layout';
import {TestRuns} from './app/test-runs';
import './styles.css';

const root = document.getElementById('root') as HTMLElement;

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/test-runs" element={<TestRuns />} />
        <Route path="/create-tenant" element={<CreateTenant />} />
        <Route path="/create-project" element={<CreateProject />} />
        <Route path="/create-api-key" element={<CreateApiKey />} />
      </Route>
    </Routes>
  </BrowserRouter>,
);
