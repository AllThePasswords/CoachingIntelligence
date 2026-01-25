import { Routes, Route } from 'react-router';
import { AppLayout } from '@/layouts';
import { Dashboard, ManagerDetail } from '@/pages';

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/manager/:managerId" element={<ManagerDetail />} />
      </Route>
    </Routes>
  );
}

export default App;
