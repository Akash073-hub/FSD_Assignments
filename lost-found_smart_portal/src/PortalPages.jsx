import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, CircleHelp, GraduationCap, Mail, MapPin, ShieldCheck, UserRound } from "lucide-react";
import "./PortalPages.css";

function PortalShell({ children }) {
  const navigate = useNavigate();
  return (
    <div className="portal-page">
      <header className="portal-header">
        <div className="portal-header-inner">
          <button className="portal-brand" onClick={() => navigate("/home")} type="button">
            <span className="portal-brand-icon"><GraduationCap size={24} /></span>
            <span><strong>FindHub Portal <em>Academic</em></strong><small>Campus Infrastructure · RV University</small></span>
          </button>
          <nav className="portal-nav" aria-label="Primary navigation">
            <button onClick={() => navigate("/home")} type="button">Home</button>
            <button onClick={() => navigate("/report-item")} type="button">Report</button>
            <button onClick={() => navigate("/search")} type="button">Matches</button>
            <button onClick={() => navigate("/notifications")} type="button" aria-label="Notifications"><Bell size={18} /></button>
            <button onClick={() => navigate("/support")} type="button" aria-label="Support"><CircleHelp size={19} /></button>
            <button className="portal-avatar" onClick={() => navigate("/profile")} type="button" aria-label="Profile">JS</button>
          </nav>
        </div>
      </header>
      <div className="portal-ribbon"><div><span>● &nbsp;FINDHUB REGISTRY</span><span><ShieldCheck size={14} /> INSTITUTIONAL SECURITY &amp; CUSTODY DIVISION</span></div></div>
      <main className="portal-main">{children}</main>
      <footer className="portal-footer">FindHub Portal · Campus Infrastructure</footer>
    </div>
  );
}

export function ProfilePage() {
  return (
    <PortalShell>
      <button className="portal-back" onClick={() => window.history.back()} type="button"><ArrowLeft size={16} /> Back</button>
      <div className="portal-heading"><span className="portal-eyebrow"><UserRound size={16} /> ACCOUNT</span><h1>My Profile</h1><p>View your campus account details and FindHub activity.</p></div>
      <section className="portal-card profile-card">
        <div className="profile-summary"><div className="profile-large-avatar">JS</div><div><h2>J. Sharma</h2><p>RV University student</p></div><span className="profile-verified"><ShieldCheck size={15} /> Verified account</span></div>
        <div className="profile-details">
          <div><span>Full name</span><strong>J. Sharma</strong></div>
          <div><span>Institutional email</span><strong>j.sharma22@rvu.edu.in</strong></div>
          <div><span>Campus</span><strong><MapPin size={15} /> RV University · Bengaluru</strong></div>
          <div><span>Account type</span><strong>Student</strong></div>
        </div>
      </section>
      <section className="profile-activity">
        <h2>Your FindHub activity</h2><div className="profile-stats"><div className="portal-card"><strong>2</strong><span>Items reported</span></div><div className="portal-card"><strong>1</strong><span>Claims in progress</span></div><div className="portal-card"><strong>0</strong><span>Unread notifications</span></div></div>
      </section>
    </PortalShell>
  );
}

export function SupportPage() {
  return (
    <PortalShell>
      <button className="portal-back" onClick={() => window.history.back()} type="button"><ArrowLeft size={16} /> Back</button>
      <div className="portal-heading"><span className="portal-eyebrow"><CircleHelp size={16} /> HELP CENTER</span><h1>FindHub Support</h1><p>Get help with reporting, searching, or claiming campus property.</p></div>
      <div className="support-grid">
        <section className="portal-card support-contact"><span className="support-icon"><Mail size={22} /></span><h2>Contact the help desk</h2><p>For account or portal issues, contact the RVU support team.</p><a href="mailto:helpdesk@rvu.edu.in">helpdesk@rvu.edu.in</a><small>Replies during university working hours</small></section>
        <section className="portal-card support-contact"><span className="support-icon"><ShieldCheck size={22} /></span><h2>Campus security</h2><p>For urgent safety concerns or valuable found property, contact Campus Security directly.</p><a href="tel:+918026912000">+91 80 2691 2000</a><small>Available 24 hours on campus</small></section>
      </div>
      <section className="portal-card support-faq"><h2>Common questions</h2><details><summary>How do I report a found item?</summary><p>Open Report from the top navigation, add a clear description and location, then submit the item record.</p></details><details><summary>How do I claim an item?</summary><p>Find the matching record in Matches and submit the ownership claim with your verified university details.</p></details><details><summary>Where can I check a claim's status?</summary><p>Open Notifications to see updates about claims, custody checks, and item matches.</p></details></section>
    </PortalShell>
  );
}
