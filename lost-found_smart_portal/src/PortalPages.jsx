import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, CircleHelp, GraduationCap, Mail, MapPin, ShieldCheck, UserRound, ClipboardCheck, Clock3, LockKeyhole, Pencil, Check, X } from "lucide-react";
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
  const defaultProfile = {
    fullName: "J. Sharma",
    email: "j.sharma22@rvu.edu.in",
    program: "RV University student",
    phone: "",
  };
  const [profile, setProfile] = useState(() => {
    try {
      return { ...defaultProfile, ...JSON.parse(window.localStorage.getItem("findhub-profile") || "{}") };
    } catch {
      return defaultProfile;
    }
  });
  const [draft, setDraft] = useState(profile);
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const initials = profile.fullName.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "JS";

  const saveProfile = (event) => {
    event.preventDefault();
    const nextProfile = { ...draft, email: profile.email };
    setProfile(nextProfile);
    setDraft(nextProfile);
    window.localStorage.setItem("findhub-profile", JSON.stringify(nextProfile));
    setIsEditing(false);
    setSaved(true);
  };

  return (
    <PortalShell>
      <button className="portal-back" onClick={() => window.history.back()} type="button"><ArrowLeft size={16} /> Back</button>
      <div className="portal-heading"><span className="portal-eyebrow"><UserRound size={16} /> ACCOUNT</span><h1>My Profile</h1><p>View your campus account details and FindHub activity.</p></div>
      <section className="portal-card profile-card">
        <div className="profile-summary">
          <div className="profile-large-avatar">{initials}</div>
          <div><h2>{profile.fullName}</h2><p>{profile.program}</p></div>
          <span className="profile-verified"><ShieldCheck size={15} /> Verified account</span>
          {!isEditing && <button type="button" className="profile-edit-button" onClick={() => { setDraft(profile); setSaved(false); setIsEditing(true); }}><Pencil size={15} /> Edit Profile</button>}
        </div>
        {saved && <p className="profile-saved-message" role="status">Profile changes saved.</p>}
        {isEditing ? (
          <form className="profile-edit-form" onSubmit={saveProfile}>
            <label>Full name<input required value={draft.fullName} onChange={(event) => setDraft({ ...draft, fullName: event.target.value })} /></label>
            <label>Academic program<input value={draft.program} onChange={(event) => setDraft({ ...draft, program: event.target.value })} /></label>
            <label>Contact phone<input type="tel" value={draft.phone} onChange={(event) => setDraft({ ...draft, phone: event.target.value })} placeholder="Add a contact number" /></label>
            <label>Institutional email<input value={profile.email} readOnly aria-describedby="profile-email-note" /></label>
            <small id="profile-email-note" className="profile-email-note">Verified university email cannot be changed here.</small>
            <div className="profile-edit-actions">
              <button type="button" className="profile-cancel-button" onClick={() => { setDraft(profile); setIsEditing(false); }}><X size={15} /> Cancel</button>
              <button type="submit" className="profile-save-button"><Check size={15} /> Save Changes</button>
            </div>
          </form>
        ) : (
          <div className="profile-details">
            <div><span>Full name</span><strong>{profile.fullName}</strong></div>
            <div><span>Institutional email</span><strong>{profile.email}</strong></div>
            <div><span>Campus</span><strong><MapPin size={15} /> RV University · Bengaluru</strong></div>
            <div><span>Account type</span><strong>Student</strong></div>
            <div><span>Contact phone</span><strong>{profile.phone || "Not added"}</strong></div>
          </div>
        )}
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

const CLAIM_RECORDS = {
  "REG-8493": { title: "Black Leather Bifold Wallet", category: "IDs & Wallets", location: "Dining Commons West", status: "Verification pending", description: "Contains a campus ID and transit pass. Claimants must verify identifying details." },
  "REG-8494": { title: "Calculus: Early Transcendentals (9th Ed)", category: "Books & Stationery", location: "Science Complex Room 204", status: "Claim review requested", description: "Hardcover copy with a blue ribbon bookmark and handwritten course notes." },
  "REG-8496": { title: "Hydro Flask 32oz Wide Mouth (Cobalt Blue)", category: "Accessories", location: "Sports Center Gym", status: "Claim in progress", description: "Blue bottle with a silver university crest sticker and intact cap strap." },
};

export function ClaimDetailsPage() {
  const navigate = useNavigate();
  const state = useLocation().state || {};
  const itemId = state.item?.id || state.id || "REG-8494";
  const item = CLAIM_RECORDS[itemId] || CLAIM_RECORDS["REG-8494"];
  return (
    <PortalShell>
      <button className="portal-back" onClick={() => window.history.back()} type="button"><ArrowLeft size={16} /> Back</button>
      <div className="portal-heading"><span className="portal-eyebrow"><ClipboardCheck size={16} /> OWNERSHIP REVIEW</span><h1>Claim Details</h1><p>Review the reported item and its current ownership verification status.</p></div>
      <section className="portal-card record-detail-card">
        <div className="record-detail-top"><div className="support-icon"><ClipboardCheck size={22} /></div><span className="record-status"><Clock3 size={14} /> {item.status}</span></div>
        <span className="record-id">#{itemId}</span><h2>{item.title}</h2><p>{item.description}</p>
        <div className="record-detail-meta"><div><span>Category</span><strong>{item.category}</strong></div><div><span>Last reported location</span><strong><MapPin size={15} /> {item.location}</strong></div><div><span>Verification</span><strong><LockKeyhole size={15} /> RVU account and evidence required</strong></div></div>
        <button type="button" className="record-primary-action" onClick={() => navigate("/claim", { state: { id: itemId, item: { id: itemId, ...item } } })}>Continue to secure claim</button>
      </section>
    </PortalShell>
  );
}

export function CustodyLogPage() {
  const navigate = useNavigate();
  const state = useLocation().state || {};
  const itemId = state.item?.id || state.id || "REG-8493";
  const item = CLAIM_RECORDS[itemId] || CLAIM_RECORDS["REG-8493"];
  return (
    <PortalShell>
      <button className="portal-back" onClick={() => window.history.back()} type="button"><ArrowLeft size={16} /> Back</button>
      <div className="portal-heading"><span className="portal-eyebrow"><LockKeyhole size={16} /> SECURE CUSTODY RECORD</span><h1>Custody Log</h1><p>Recorded custody events for this FindHub item.</p></div>
      <section className="portal-card record-detail-card">
        <div className="record-detail-top"><div className="support-icon"><LockKeyhole size={22} /></div><span className="record-status"><ShieldCheck size={14} /> In storage</span></div>
        <span className="record-id">#{itemId}</span><h2>{item.title}</h2><p>{item.location} · {item.category}</p>
        <ol className="custody-timeline"><li><strong>Item logged into campus custody</strong><span>Campus Security Marshal · Dining Commons West Custody Locker #DC-104-B</span></li><li><strong>Item sealed and stored</strong><span>Custody record verified and linked to item #{itemId}</span></li><li><strong>Awaiting owner verification</strong><span>Release requires a successful ownership claim and identity check.</span></li></ol>
        <button type="button" className="record-primary-action" onClick={() => navigate("/claim-details", { state: { id: itemId, item } })}>View ownership claim</button>
      </section>
    </PortalShell>
  );
}
