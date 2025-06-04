import {Link, Route, Routes} from 'react-router-dom';

import {Home} from './home';
import {Reports} from './reports';

export function App() {
  return (
    <div className="p-4">
      <div role="navigation">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/reports">Reports</Link>
          </li>
        </ul>
        <hr />
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </div>
  );
}
