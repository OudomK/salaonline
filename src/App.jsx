import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

import Login from "./pages/client/Login";
import Register from "./pages/client/Register";
import ForgotPassword from "./pages/client/ForgotPassword";
import Home from "./pages/client/HomePage";
import Profile from "./pages/client/Profile";
import PlacementTest from "./pages/client/PlacementTest";
import CourseDetail from "./pages/client/CourseDetail";
import Homework from "./pages/client/Homework";
import LoginAdmin from "./pages/admin/LoginAdmin";
import Dashboard from "./pages/admin/Dashboard";
import StudentList from "./pages/admin/StudentList";
import ForgotPasswordAdmin from "./pages/admin/ForgotPasswordAdmin";
import ExamRequest from "./pages/admin/ExamRequest";
import CourseManager from "./pages/admin/CourseManager";
import HomeworkManager from "./pages/admin/HomeworkManager";
import AdminSettings from "./pages/admin/AdminSettings";
import UserAccount from "./pages/client/UserAccount";
import ComingSoon from "./pages/client/ComingSoon";
import MyLearning from "./pages/client/MyLearning";
import OtpVerification from "./pages/client/OtpVerification";
import LessonManager from "./pages/admin/LessonManager/LessonManager";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/otp-verification" element={<OtpVerification />} />
        <Route path="/admin/login" element={<LoginAdmin />} />
        <Route path="/admin/forgot-password" element={<ForgotPasswordAdmin />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="students" element={<StudentList />} />
          <Route path="requests" element={<ExamRequest />} />
          <Route path="courses" element={<CourseManager />} />
          <Route path="homework" element={<HomeworkManager />} />
          <Route path="lesson" element={<LessonManager />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/account" element={<UserAccount />} />
          <Route path="/placement-test" element={<PlacementTest />} />
          <Route path="/course-detail" element={<CourseDetail />} />
          <Route path="/homework" element={<Homework />} />
          <Route path="/my-learning" element={<MyLearning />} />
          <Route path="/certificate" element={<ComingSoon title="វិញ្ញាបនបត្រ (Certificate)" />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;