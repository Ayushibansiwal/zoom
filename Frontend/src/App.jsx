import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";

import LandingPage from "./pages/LandingPage";
import SignInPage from "./pages/SigninPage";
import Dashboard from "./pages/Dashboard";
import VideoMeet from "./pages/VideoMeet";

function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />}></Route>
            <Route path="/signin" element={<SignInPage />}></Route>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/:url" element={<VideoMeet/>}></Route>
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
