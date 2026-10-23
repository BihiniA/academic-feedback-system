import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';

// Shared components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

// Admin components
import AdminHeader from './components/Admin/Header';
import AdminSidebar from './components/Admin/SideBar';
import Admin from './components/Admin/Admin';
import CreateFeedback from './components/Admin/CreateFeedback';
import FeedbackApproval from './components/Admin/FeedbackApproval';

// AI Feedback Pages
import AnalysisResult from './components/Admin/AnalysisResult';
import FeedbackReview from './components/Admin/FeedbackReview';
import FeedbackHistory from './components/Admin/FeedbackHistory';

// Layout component for user pages
const UserLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <div className="flex-grow">{children}</div>
    <Footer />
  </div>
);

// Layout component for admin pages
const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar isOpen={sidebarOpen} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader onMenuClick={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* =========================
            PUBLIC PAGES
        ========================== */}

        {/* User Routes */}
        <Route
          path="/"
          element={
            <UserLayout>
              <Home />
            </UserLayout>
          }
        />

        <Route
          path="/about"
          element={
            <UserLayout>
              <About />
            </UserLayout>
          }
        />

        <Route
          path="/sign-in"
          element={
            <UserLayout>
              <Login />
            </UserLayout>
          }
        />

        <Route
          path="/sign-up"
          element={
            <UserLayout>
              <SignUp />
            </UserLayout>
          }
        />

        {/* =========================
            AI ACADEMIC FEEDBACK
        ========================== */}
        <Route
          path="/admin"
          element={
            <AdminLayout>
              <Admin />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/feedback/create-feedback"
          element={
            <AdminLayout>
              <CreateFeedback />
            </AdminLayout>
          }
        />

        <Route
          path="/analysis"
          element={
            <UserLayout>
              <AnalysisResult />
            </UserLayout>
          }
        />

        <Route
          path="/analysis/:id"
          element={
            <UserLayout>
              <AnalysisResult />
            </UserLayout>
          }
        />

        <Route
          path="/feedback-review"
          element={
            <UserLayout>
              <FeedbackReview />
            </UserLayout>
          }
        />
        <Route
  path="/admin/feedback/:id/approve"
  element={<FeedbackApproval />}
/>
        <Route
          path="/history"
          element={<FeedbackHistory />}
        />
      </Routes>
    </Router>
  );
}

export default App;