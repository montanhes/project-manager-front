import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/Login';
import { DashboardPage } from '../pages/Dashboard';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { ProjectsListPage } from '../pages/Projects/List';
import { CreateProjectPage } from '../pages/Projects/Create';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardPage />}>
          <Route index element={<Navigate to="/projects" replace />} />
          <Route path="/projects" element={<ProjectsListPage />} />
          <Route path="/projects/create" element={<CreateProjectPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
