import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/Login';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}
