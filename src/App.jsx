import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// --- LAYOUTS ---
import MainLayout from "./layouts/MainLayout";   // សម្រាប់ User (មាន Navbar)
import AdminLayout from "./layouts/AdminLayout"; // សម្រាប់ Admin (មាន Sidebar) - *ត្រូវបង្កើត*

// --- CLIENT PAGES (USER) ---
import Login from "./pages/client/Login";
import Register from "./pages/client/Register";
import ForgotPassword from "./pages/client/ForgotPassword";
import Home from "./pages/client/HomePage";
import Profile from "./pages/client/Profile";
import PlacementTest from "./pages/client/PlacementTest";
import CourseDetail from "./pages/client/CourseDetail";
import Homework from "./pages/client/Homework";

// --- ADMIN PAGES ---
import LoginAdmin from "./pages/admin/LoginAdmin"; // Login របស់ Admin
import Dashboard from "./pages/admin/Dashboard";   // Dashboard - *ត្រូវបង្កើត*
import StudentList from "./pages/admin/StudentList"; // Student List - *ត្រូវបង្កើត*
import ForgotPasswordAdmin from "./pages/admin/ForgotPasswordAdmin";
import ExamRequest from "./pages/admin/ExamRequest";
import CourseManager from "./pages/admin/CourseManager";
import HomeworkManager from "./pages/admin/HomeworkManager";
import AdminSettings from "./pages/admin/AdminSettings";
import UserAccount from "./pages/client/UserAccount";
import ComingSoon from "./pages/client/ComingSoon";
import MyLearning from "./pages/client/MyLearning";
import OtpVerification from "./pages/client/OtpVerification";

function App() {
  
  // (Optional) Function សម្រាប់ឆែកថាមានសិទ្ធិជា Admin អត់?
  // const isAdmin = localStorage.getItem("userRole") === "admin";

  return (
    <BrowserRouter>
      <Routes>
        
        {/* =========================================
            1. PUBLIC ROUTES (User Login/Register)
           ========================================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/otp-verification" element={<OtpVerification />} />


        {/* =========================================
            2. ADMIN LOGIN (ដាច់ដោយឡែក)
           ========================================= */}
        <Route path="/admin/login" element={<LoginAdmin />} />
        <Route path="/admin/forgot-password" element={<ForgotPasswordAdmin />} /> 
   
        {/* =========================================
            3. ADMIN SYSTEM ROUTES (Protected)
           ========================================= */}
        <Route path="/admin" element={<AdminLayout />}>
           {/* ចូល /admin ឱ្យរត់ទៅ dashboard តែម្តង */}
           <Route index element={<Navigate to="/admin/dashboard" replace />} />
           
           <Route path="dashboard" element={<Dashboard />} />
           <Route path="students" element={<StudentList />} />
            <Route path="requests" element={<ExamRequest />} />
           <Route path="courses" element={<CourseManager />} />
           <Route path="homework" element={<HomeworkManager />} />
           <Route path="settings" element={<AdminSettings    />} />
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
           <Route path="/course-detail" element={<CourseDetail />} />
           <Route path="/homework" element={<Homework />} />
           <Route path="/my-learning" element={<MyLearning />} />
           <Route 
            path="/certificate" 
            element={<ComingSoon title="វិញ្ញាបនបត្រ (Certificate)" />} 
          />
        </Route>


        {/* =========================================
            5. CATCH ALL (Page Not Found)
           ========================================= */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;