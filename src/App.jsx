// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import Login from "./pages/Login";      
// import Register from "./pages/Register"; 
// import ForgotPassword from "./pages/ForgotPassword";
// import PlacementTest from "./pages/PlacementTest";
// import Home from "./pages/HomePage";
// import CourseDetail from "./pages/CourseDetail";
// import Homework from "./pages/Homework";
// import Profile from "./pages/Profile";



// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
      
//         <Route path="/" element={<Home />} />

//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="*" element={<Navigate to="/login" />} />
//         <Route path="/forgot-password" element={<ForgotPassword />} />


//         <Route path="/placement-test" element={<PlacementTest />} />
//         <Route path="/course-detail" element={<CourseDetail />} />
//         <Route path="/homework" element={<Homework />} />
//         <Route path="/profile" element={<Profile />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }
// export default App;



import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout"; 

// Pages Imports
import Login from "./pages/Login";
import Register from "./pages/Register";

import PlacementTest from "./pages/PlacementTest";
import Profile from "./pages/Profile";
import CourseDetail from "./pages/CourseDetail"; // 2. Import CourseDetail
import Homework from "./pages/Homework"; // 3. Import Homework
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/HomePage";
import MyLearning from "./pages/MyLearning";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* --- PUBLIC ROUTES (ពេញអេក្រង់ អត់មាន Header/Footer) --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword/>} /> {/* ដាក់នៅទីនេះ */}
        
        {/* --- PRIVATE ROUTES (ប្រើ MainLayout មាន Header/Footer/Nav) --- */}
        <Route element={<MainLayout />}>
           {/* Redirect root "/" to "/home" */}
           <Route path="/" element={<Navigate to="/home" />} />
           
           {/* Main Pages */}
           <Route path="/home" element={<Home />} />
           <Route path="/profile" element={<Profile />} />
           <Route path="/placement-test" element={<PlacementTest />} />
           
           {/* Learning Pages */}
           <Route path="/course-detail" element={<CourseDetail />} /> {/* ដាក់នៅទីនេះ */}
           <Route path="/homework" element={<Homework />} />       {/* ដាក់នៅទីនេះ */}
           <Route path="/my-learning" element={<MyLearning />} />
        </Route>

        {/* Catch All - បើវាយ Link ខុស ឱ្យទៅ Login វិញ */}
        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;