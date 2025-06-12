import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Layout } from '@/components/layout/Layout';
import { LoadingScreen } from '@/components/ui/loading-screen';

// Lazy load components
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Login = lazy(() => import('@/pages/auth/Login'));
const Signup = lazy(() => import('@/pages/auth/Signup'));
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/auth/ResetPassword'));
const Profile = lazy(() => import('@/pages/Profile'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// Admin routes
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const UserManagement = lazy(() => import('@/pages/admin/UserManagement'));
const DepartmentManagement = lazy(() => import('@/pages/admin/DepartmentManagement'));
const Settings = lazy(() => import('@/pages/admin/Settings'));

// Manager routes
const ManagerDashboard = lazy(() => import('@/pages/manager/ManagerDashboard'));
const TaskManagement = lazy(() => import('@/pages/manager/TaskManagement'));
const TeamManagement = lazy(() => import('@/pages/manager/TeamManagement'));
const ProjectManagement = lazy(() => import('@/pages/manager/ProjectManagement'));

// Staff routes
const StaffDashboard = lazy(() => import('@/pages/staff/StaffDashboard'));
const MyTasks = lazy(() => import('@/pages/staff/MyTasks'));
const TimeTracking = lazy(() => import('@/pages/staff/TimeTracking'));
const Documents = lazy(() => import('@/pages/staff/Documents'));

// Office Admin routes
const OfficeAdminDashboard = lazy(() => import('@/pages/office-admin/OfficeAdminDashboard'));
const InventoryManagement = lazy(() => import('@/pages/office-admin/InventoryManagement'));
const ProcurementManagement = lazy(() => import('@/pages/office-admin/ProcurementManagement'));
const DocumentManagement = lazy(() => import('@/components/shared/DocumentManagement'));

// Protected route wrapper
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

// Route wrapper with suspense
const RouteWithSuspense = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingScreen />}>
    {children}
  </Suspense>
);

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<RouteWithSuspense><Login /></RouteWithSuspense>} />
      <Route path="/signup" element={<RouteWithSuspense><Signup /></RouteWithSuspense>} />
      <Route path="/forgot-password" element={<RouteWithSuspense><ForgotPassword /></RouteWithSuspense>} />
      <Route path="/reset-password" element={<RouteWithSuspense><ResetPassword /></RouteWithSuspense>} />

      {/* Protected routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        {/* Common routes */}
        <Route index element={<RouteWithSuspense><Dashboard /></RouteWithSuspense>} />
        <Route path="profile" element={<RouteWithSuspense><Profile /></RouteWithSuspense>} />

        {/* Admin routes */}
        <Route path="admin" element={<ProtectedRoute allowedRoles={['admin']}><RouteWithSuspense><AdminDashboard /></RouteWithSuspense></ProtectedRoute>} />
        <Route path="admin/users" element={<ProtectedRoute allowedRoles={['admin']}><RouteWithSuspense><UserManagement /></RouteWithSuspense></ProtectedRoute>} />
        <Route path="admin/departments" element={<ProtectedRoute allowedRoles={['admin']}><RouteWithSuspense><DepartmentManagement /></RouteWithSuspense></ProtectedRoute>} />
        <Route path="admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><RouteWithSuspense><Settings /></RouteWithSuspense></ProtectedRoute>} />

        {/* Manager routes */}
        <Route path="manager" element={<ProtectedRoute allowedRoles={['manager']}><RouteWithSuspense><ManagerDashboard /></RouteWithSuspense></ProtectedRoute>} />
        <Route path="manager/tasks" element={<ProtectedRoute allowedRoles={['manager']}><RouteWithSuspense><TaskManagement /></RouteWithSuspense></ProtectedRoute>} />
        <Route path="manager/team" element={<ProtectedRoute allowedRoles={['manager']}><RouteWithSuspense><TeamManagement /></RouteWithSuspense></ProtectedRoute>} />
        <Route path="manager/projects" element={<ProtectedRoute allowedRoles={['manager']}><RouteWithSuspense><ProjectManagement /></RouteWithSuspense></ProtectedRoute>} />

        {/* Staff routes */}
        <Route path="staff" element={<ProtectedRoute allowedRoles={['staff']}><RouteWithSuspense><StaffDashboard /></RouteWithSuspense></ProtectedRoute>} />
        <Route path="staff/tasks" element={<ProtectedRoute allowedRoles={['staff']}><RouteWithSuspense><MyTasks /></RouteWithSuspense></ProtectedRoute>} />
        <Route path="staff/time" element={<ProtectedRoute allowedRoles={['staff']}><RouteWithSuspense><TimeTracking /></RouteWithSuspense></ProtectedRoute>} />
        <Route path="staff/documents" element={<ProtectedRoute allowedRoles={['staff']}><RouteWithSuspense><Documents /></RouteWithSuspense></ProtectedRoute>} />

        {/* Office Admin routes */}
        <Route path="office-admin" element={<ProtectedRoute allowedRoles={['office_admin']}><RouteWithSuspense><OfficeAdminDashboard /></RouteWithSuspense></ProtectedRoute>} />
        <Route path="office-admin/inventory" element={<ProtectedRoute allowedRoles={['office_admin']}><RouteWithSuspense><InventoryManagement /></RouteWithSuspense></ProtectedRoute>} />
        <Route path="office-admin/procurement" element={<ProtectedRoute allowedRoles={['office_admin']}><RouteWithSuspense><ProcurementManagement /></RouteWithSuspense></ProtectedRoute>} />
        <Route path="office-admin/documents" element={<ProtectedRoute allowedRoles={['office_admin']}><RouteWithSuspense><DocumentManagement /></RouteWithSuspense></ProtectedRoute>} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<RouteWithSuspense><NotFound /></RouteWithSuspense>} />
    </Routes>
  );
}; 