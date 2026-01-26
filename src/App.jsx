import { Routes, Route } from 'react-router';
import { AppLayout } from '@/layouts';
import { Dashboard, ManagerDetail } from '@/pages';
import { PasswordGate } from '@/components/PasswordGate';

function App() {
  return (
    <PasswordGate>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/manager/:managerId" element={<ManagerDetail />} />
        </Route>
      </Routes>
    </PasswordGate>
  );
}

export default App;
