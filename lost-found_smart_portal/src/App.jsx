import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import LoginPage from "./Loginpage";
import Findhubportal from "./Findhubportal";
import Searchpage from "./Searchpage";
import ClaimPage from "./Claimpage";
import ReportItem from "./Reportitem";
import Notifications from "./Notifications";
import RulesPage from "./Rulespage";
import "./Theme.css";

function LoginRoute() {
    const navigate = useNavigate();

    return <LoginPage onLoginSuccess={() => navigate("/home")} />;
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginRoute />} />
                <Route path="/home" element={<Findhubportal />} />
                <Route path="/search" element={<Searchpage />} />
                <Route path="/claim" element={<ClaimPage />} />
                <Route path="/report-item" element={<ReportItem />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/rules" element={<RulesPage />} />
            </Routes>
        </BrowserRouter>
    );
}