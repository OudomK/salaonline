// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import MainLayout from "./layouts/MainLayout"; 

// // Pages Imports
// import Login from "./pages/client/Login";
// import Register from "./pages/client/Register";

// import PlacementTest from "./pages/client/PlacementTest";
// import Profile from "./pages/client/Profile";
// import CourseDetail from "./pages/client/CourseDetail"; // 2. Import CourseDetail
// import Homework from "./pages/client/Homework"; // 3. Import Homework
// import ForgotPassword from "./pages/client/ForgotPassword";
// import Home from "./pages/client/HomePage";
// import MyLearning from "./pages/client/MyLearning";

// function App() {
//   return (  
//     <BrowserRouter>
//       <Routes>
        
//         {/* --- PUBLIC ROUTES (ពេញអេក្រង់ អត់មាន Header/Footer) --- */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/forgot-password" element={<ForgotPassword/>} /> {/* ដាក់នៅទីនេះ */}
        
//         {/* --- PRIVATE ROUTES (ប្រើ MainLayout មាន Header/Footer/Nav) --- */}
//         <Route element={<MainLayout />}>
//            {/* Redirect root "/" to "/home" */}
//            <Route path="/" element={<Navigate to="/home" />} />
           
//            {/* Main Pages */}
//            <Route path="/home" element={<Home />} />
//            <Route path="/profile" element={<Profile />} />
//            <Route path="/placement-test" element={<PlacementTest />} />
           
//            {/* Learning Pages */}
//            <Route path="/course-detail" element={<CourseDetail />} /> {/* ដាក់នៅទីនេះ */}
//            <Route path="/homework" element={<Homework />} />       {/* ដាក់នៅទីនេះ */}
//            <Route path="/my-learning" element={<MyLearning />} />
//         </Route>

//         {/* Catch All - បើវាយ Link ខុស ឱ្យទៅ Login វិញ */}
//         <Route path="*" element={<Navigate to="/login" />} />

//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;


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
import MyLearning from "./pages/client/MyLearning";

// --- ADMIN PAGES ---
import LoginAdmin from "./pages/admin/LoginAdmin"; // Login របស់ Admin
import Dashboard from "./pages/admin/Dashboard";   // Dashboard - *ត្រូវបង្កើត*
import StudentList from "./pages/admin/StudentList"; // Student List - *ត្រូវបង្កើត*
import ForgotPasswordAdmin from "./pages/admin/ForgotPasswordAdmin";

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


        {/* =========================================
            2. ADMIN LOGIN (ដាច់ដោយឡែក)
           ========================================= */}
        <Route path="/admin/login" element={<LoginAdmin />} />
        <Route path="/admin/forgot-password" element={<ForgotPasswordAdmin />} /> {/* ថែមថ្មីត្រង់នេះ */}


        {/* =========================================
            3. ADMIN SYSTEM ROUTES (Protected)
           ========================================= */}
        <Route path="/admin" element={<AdminLayout />}>
           {/* ចូល /admin ឱ្យរត់ទៅ dashboard តែម្តង */}
           <Route index element={<Navigate to="/admin/dashboard" replace />} />
           
           <Route path="dashboard" element={<Dashboard />} />
           <Route path="students" element={<StudentList />} />
           
           {/* អាចថែម Route Admin ផ្សេងទៀតនៅទីនេះ */}
           {/* <Route path="courses" element={<CourseManager />} /> */}
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
           <Route path="/placement-test" element={<PlacementTest />} />
           
           {/* Learning Pages */}
           <Route path="/course-detail" element={<CourseDetail />} />
           <Route path="/homework" element={<Homework />} />
           <Route path="/my-learning" element={<MyLearning />} />
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