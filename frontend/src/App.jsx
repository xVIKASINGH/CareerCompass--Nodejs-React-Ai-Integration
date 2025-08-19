
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import './index.css';
import Landingpage from "./Pages/LandingPage.jsx/Landingpage";
import Page from "./Pages/Signup/Page.jsx";
import LoginPage from "./Pages/Login/LoginPage";
import Dashboard from "./Pages/Dashboard/dashboard";
const App=()=>{
  return (
   <Router>
   <Routes>
      <Route path="/" element={<Landingpage/>}/>
      <Route path="/login" element={<LoginPage/>}/>
      <Route path="/signup" element={<Page />} />
      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="*" element={<h1>Page not Found</h1>}/>
   </Routes>
   </Router>
  )
}

export default App