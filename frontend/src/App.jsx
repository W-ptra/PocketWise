import { BrowserRouter, Routes, Route } from "react-router-dom";
import HandleGoogleOauthCallback from "./pages/auth/handleGoogleAuthCallback";
import RequestChangePassword from "./pages/dashboard/profile/_components/requestChangePassword";
import TransactionHistory from "./pages/dashboard/transaction-history/page";
import ChangePassword from "./pages/auth/changePassword";
import LandingPage from "./pages/landing/page";
import Dashboard from "./pages/dashboard/page";
import Register from "./pages/auth/register";
import Analysis from "./pages/dashboard/analysis/page";
import Profile from "./pages/dashboard/profile/page";
import Privacy from "./pages/privacy/page";
import Login from "./pages/auth/login";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/request-change-password"
            element={<RequestChangePassword />}
          />
          <Route path="/change-password/:id" element={<ChangePassword />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transaction-history"
            element={
              <ProtectedRoute>
                <TransactionHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analysis"
            element={
              <ProtectedRoute>
                <Analysis />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/privacy" element={<Privacy />} />
          <Route
            path="/auth/google/callback"
            element={<HandleGoogleOauthCallback />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
