import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/Login';
import { DashboardPage } from '../pages/Dashboard';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { ProjectsListPage } from '../pages/Projects/List';
import { CreateProjectPage } from '../pages/Projects/Create';
import { ProjectDetailPage } from '../pages/Projects/Detail';
import { CreateTaskPage } from '../pages/Tasks/Create';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardPage />}>
          <Route index element={<Navigate to="/projects" replace />} />
          <Route path="/projects" element={<ProjectsListPage />} />
          <Route path="/projects/create" element={<CreateProjectPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/projects/:projectId/tasks/create" element={<CreateTaskPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
