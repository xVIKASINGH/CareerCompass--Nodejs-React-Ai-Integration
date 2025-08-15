
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import './index.css';
import Landingpage from "./Pages/LandingPage.jsx/Landingpage";
import Page from "./Pages/Signup/Page.jsx";
const App=()=>{
  return (
   <Router>
   <Routes>
      <Route path="/" element={<Landingpage/>}/>
      <Route path="/login" element = {<h1>Login Page</h1>}/>
      <Route path="/signup" element = {<Page />} />
      <Route path="*" element={<h1>Page not Found</h1>}/>
   </Routes>
   </Router>
  )
}

export default App