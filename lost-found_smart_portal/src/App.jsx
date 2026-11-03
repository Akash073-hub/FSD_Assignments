import { BrowserRouter, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import LoginPage from "./Loginpage";
import ForgotPasswordPage from "./ForgotPasswordPage";
import Findhubportal from "./Findhubportal";
import Searchpage from "./Searchpage";
import ClaimPage from "./Claimpage";
import ReportItem from "./Reportitem";
import Notifications from "./Notifications";
import RulesPage from "./Rulespage";
import { AdminClaimsPage, AdminSupportPage, ClaimDetailsPage, CustodyLogPage, ProfilePage, SupportPage } from "./PortalPages";
import "./Theme.css";

function LoginRoute() {
    const navigate = useNavigate();

    return (
        <LoginPage
            onLoginSuccess={() => navigate("/home")}
            onForgotPassword={() => navigate("/forgot-password")}
        />
    );
}

function ProtectedRoute({ children, roles }) {
    let user = null;
    try { user = JSON.parse(window.localStorage.getItem("findhub-user") || "null"); } catch { user = null; }
    const token = window.localStorage.getItem("findhub-token");
    if (!token || !user) return <Navigate to="/" replace />;
    if (roles && !roles.includes(user.role)) return <Navigate to="/home" replace />;
    return children;
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginRoute />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/home" element={<ProtectedRoute><Findhubportal /></ProtectedRoute>} />
                <Route path="/search" element={<ProtectedRoute><Searchpage /></ProtectedRoute>} />
                <Route path="/claim" element={<ProtectedRoute><ClaimPage /></ProtectedRoute>} />
                <Route path="/report-item" element={<ProtectedRoute><ReportItem /></ProtectedRoute>} />
                <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
                <Route path="/rules" element={<ProtectedRoute><RulesPage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/support" element={<ProtectedRoute><SupportPage /></ProtectedRoute>} />
                <Route path="/claim-details" element={<ProtectedRoute><ClaimDetailsPage /></ProtectedRoute>} />
                <Route path="/custody-log" element={<ProtectedRoute><CustodyLogPage /></ProtectedRoute>} />
                <Route path="/admin/claims" element={<ProtectedRoute roles={["staff", "admin"]}><AdminClaimsPage /></ProtectedRoute>} />
                <Route path="/admin/support" element={<ProtectedRoute roles={["staff", "admin"]}><AdminSupportPage /></ProtectedRoute>} />
            </Routes>
        </BrowserRouter>
    );
}
