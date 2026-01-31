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
import StudentList from "./pages/admin/StudentManger/StudentList";
import ForgotPasswordAdmin from "./pages/admin/ForgotPasswordAdmin";
import ExamRequest from "./pages/admin/ExamRequest";
import CourseManager from "./pages/admin/CourseManager/CourseManager";
import HomeworkManager from "./pages/admin/HomeworkManager";
import AdminSettings from "./pages/admin/AdminSettings";
import UserAccount from "./pages/client/UserAccount";
import ComingSoon from "./pages/client/ComingSoon";
import MyLearning from "./pages/client/MyLearning";
import OtpVerification from "./pages/client/OtpVerification";
import Contact from "./pages/client/Contact";
import About from "./pages/client/About";
import LessonManager from "./pages/admin/LessonManager/LessonManager";
import UserManager from "./pages/admin/UserManger/UserManager";
import AuthProvider from "./layouts/AuthProvider";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/otp-verification" element={<OtpVerification />} />
          <Route path="/admin/login" element={<LoginAdmin />} />
          <Route
            path="/admin/forgot-password"
            element={<ForgotPasswordAdmin />}
          />

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
            <Route path="user" element={<UserManager />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* =========================================
            4. USER ROUTES (Protected by MainLayout)
           ========================================= */}
          <Route element={<MainLayout />}>
            {/* Redirect root "/" to "/home" */}
            <Route path="/" element={<Navigate to="/home" replace />} />

            {/* Main Pages */}
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/account" element={<UserAccount />} />
            <Route path="/placement-test" element={<PlacementTest />} />

            {/* Learning Pages */}
            <Route path="/course-detail/:id" element={<CourseDetail />} />
            <Route path="/homework" element={<Homework />} />
            <Route path="/my-learning" element={<MyLearning />} />
            <Route
              path="/certificate"
              element={<ComingSoon title="វិញ្ញាបនបត្រ (Certificate)" />}
            />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
          </Route>

          {/* =========================================
            5. CATCH ALL (Page Not Found)
           ========================================= */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
