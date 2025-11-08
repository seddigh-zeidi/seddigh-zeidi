import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import Keywords from './pages/Keywords';
import PillarCluster from './pages/PillarCluster';
import Calendar from './pages/Calendar';
import Content from './pages/Content';
import Publish from './pages/Publish';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/keywords" element={<Keywords />} />
          <Route path="/pillar" element={<PillarCluster />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/content" element={<Content />} />
          <Route path="/publish" element={<Publish />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
      <ToastContainer
        position="top-left"
        autoClose={3000}
        rtl={true}
        theme="colored"
      />
    </Router>
  );
}

export default App;
