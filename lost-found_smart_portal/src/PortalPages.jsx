import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, CircleHelp, GraduationCap, Mail, MapPin, ShieldCheck, UserRound, ClipboardCheck, Clock3, LockKeyhole, Pencil, Check, X, Send } from "lucide-react";
import { apiRequest } from "./api";
import "./PortalPages.css";

const readUser = () => {
  try { return JSON.parse(window.localStorage.getItem("findhub-user") || "null"); } catch { return null; }
};
function PortalShell({ children }) {
  const navigate = useNavigate();
  const user = readUser();
  const initials = user?.fullName?.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "FH";
  return <div className="portal-page">
    <header className="portal-header"><div className="portal-header-inner">
      <button className="portal-brand" onClick={() => navigate("/home")} type="button"><span className="portal-brand-icon"><GraduationCap size={24} /></span><span><strong>FindHub Portal <em>Academic</em></strong><small>Campus Infrastructure · RV University</small></span></button>
      <nav className="portal-nav" aria-label="Primary navigation"><button onClick={() => navigate("/home")} type="button">Home</button><button onClick={() => navigate("/report-item")} type="button">Report</button><button onClick={() => navigate("/search")} type="button">Matches</button><button onClick={() => navigate("/notifications")} type="button" aria-label="Notifications"><Bell size={18} /></button><button onClick={() => navigate("/support")} type="button" aria-label="Support"><CircleHelp size={19} /></button>{["staff", "admin"].includes(user?.role) && <><button onClick={() => navigate("/admin/claims")} type="button">Review Claims</button><button onClick={() => navigate("/admin/support")} type="button">Support Queue</button></>}<button className="portal-avatar" onClick={() => navigate("/profile")} type="button" aria-label="Profile">{initials}</button></nav>
    </div></header><div className="portal-ribbon"><div><span>● &nbsp;FINDHUB REGISTRY</span><span><ShieldCheck size={14} /> INSTITUTIONAL SECURITY &amp; CUSTODY DIVISION</span></div></div><main className="portal-main">{children}</main><footer className="portal-footer">FindHub Portal · Campus Infrastructure</footer>
  </div>;
}

export function ProfilePage() {
  const user = readUser();
  const [profile, setProfile] = useState(user || { fullName: "", email: "", program: "", phone: "" });
  const [draft, setDraft] = useState(profile);
  const [activity, setActivity] = useState({ itemsReported: 0, claims: 0, unreadNotifications: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const initials = profile.fullName?.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "FH";

  useEffect(() => {
    let active = true;
    Promise.all([apiRequest("/profile"), apiRequest("/profile/activity")]).then(([profileResponse, activityResponse]) => {
      if (!active) return;
      setProfile(profileResponse.user); setDraft(profileResponse.user); setActivity(activityResponse);
      window.localStorage.setItem("findhub-user", JSON.stringify(profileResponse.user));
    }).catch((cause) => { if (active) setError(cause.message); });
    return () => { active = false; };
  }, []);
  const saveProfile = async (event) => {
    event.preventDefault(); setBusy(true); setError(""); setMessage("");
    try { const result = await apiRequest("/profile", { method: "PUT", body: JSON.stringify(draft) }); setProfile(result.user); setDraft(result.user); window.localStorage.setItem("findhub-user", JSON.stringify(result.user)); setIsEditing(false); setMessage("Profile changes saved to your FindHub account."); }
    catch (cause) { setError(cause.message); }
    finally { setBusy(false); }
  };
  return <PortalShell>
    <button className="portal-back" onClick={() => window.history.back()} type="button"><ArrowLeft size={16} /> Back</button>
    <div className="portal-heading"><span className="portal-eyebrow"><UserRound size={16} /> ACCOUNT</span><h1>My Profile</h1><p>View your campus account details and FindHub activity.</p></div>
    {error && <p className="portal-feedback portal-feedback--error" role="alert">{error}</p>}{message && <p className="profile-saved-message" role="status">{message}</p>}
    <section className="portal-card profile-card"><div className="profile-summary"><div className="profile-large-avatar">{initials}</div><div><h2>{profile.fullName}</h2><p>{profile.program}</p></div><span className="profile-verified"><ShieldCheck size={15} /> {profile.role || "student"} account</span>{!isEditing && <button type="button" className="profile-edit-button" onClick={() => { setDraft(profile); setIsEditing(true); }}><Pencil size={15} /> Edit Profile</button>}</div>
      {isEditing ? <form className="profile-edit-form" onSubmit={saveProfile}><label>Full name<input required maxLength={100} value={draft.fullName || ""} onChange={(event) => setDraft({ ...draft, fullName: event.target.value })} /></label><label>Academic program<input maxLength={120} value={draft.program || ""} onChange={(event) => setDraft({ ...draft, program: event.target.value })} /></label><label>Contact phone<input type="tel" maxLength={15} value={draft.phone || ""} onChange={(event) => setDraft({ ...draft, phone: event.target.value })} placeholder="10-digit mobile number" /></label><label>Institutional email<input value={profile.email || ""} readOnly /></label><small className="profile-email-note">Verified university email cannot be changed here.</small><div className="profile-edit-actions"><button type="button" className="profile-cancel-button" onClick={() => { setDraft(profile); setIsEditing(false); }}><X size={15} /> Cancel</button><button type="submit" className="profile-save-button" disabled={busy}><Check size={15} /> {busy ? "Saving…" : "Save Changes"}</button></div></form> : <div className="profile-details"><div><span>Full name</span><strong>{profile.fullName}</strong></div><div><span>Institutional email</span><strong>{profile.email}</strong></div><div><span>Campus</span><strong><MapPin size={15} /> RV University · Bengaluru</strong></div><div><span>Account type</span><strong>{profile.role || "Student"}</strong></div><div><span>Contact phone</span><strong>{profile.phone || "Not added"}</strong></div></div>}
    </section>
    <section className="profile-activity"><h2>Your FindHub activity</h2><div className="profile-stats"><div className="portal-card"><strong>{activity.itemsReported}</strong><span>Items reported</span></div><div className="portal-card"><strong>{activity.claims}</strong><span>Claims submitted</span></div><div className="portal-card"><strong>{activity.unreadNotifications}</strong><span>Unread notifications</span></div></div></section>
  </PortalShell>;
}

export function SupportPage() {
  const user = readUser();
  const [subject, setSubject] = useState(""); const [message, setMessage] = useState("");
  const [tickets, setTickets] = useState([]); const [feedback, setFeedback] = useState(""); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  useEffect(() => { apiRequest("/support").then((result) => setTickets(result.tickets || [])).catch((cause) => setError(cause.message)); }, []);
  const sendSupport = async (event) => { event.preventDefault(); setBusy(true); setFeedback(""); setError(""); try { const result = await apiRequest("/support", { method: "POST", body: JSON.stringify({ name: user?.fullName, subject, message }) }); setTickets((previous) => [result.ticket, ...previous]); setSubject(""); setMessage(""); setFeedback("Your request was sent and saved. The help desk can follow up at your university email."); } catch (cause) { setError(cause.message); } finally { setBusy(false); } };
  return <PortalShell><button className="portal-back" onClick={() => window.history.back()} type="button"><ArrowLeft size={16} /> Back</button><div className="portal-heading"><span className="portal-eyebrow"><CircleHelp size={16} /> HELP CENTER</span><h1>FindHub Support</h1><p>Send a support request. It will be saved to your account for follow-up.</p></div>
    <div className="support-grid"><section className="portal-card support-contact"><span className="support-icon"><Mail size={22} /></span><h2>Contact the help desk</h2><p>For account or portal issues, contact the RVU support team.</p><a href="mailto:helpdesk@rvu.edu.in">helpdesk@rvu.edu.in</a><small>Replies during university working hours</small></section><section className="portal-card support-contact"><span className="support-icon"><ShieldCheck size={22} /></span><h2>Campus security</h2><p>For urgent safety concerns or valuable found property, contact Campus Security directly.</p><a href="tel:+918026912000">+91 80 2691 2000</a><small>Available 24 hours on campus</small></section></div>
    <section className="portal-card support-form-card"><h2>Submit a request</h2>{error && <p className="portal-feedback portal-feedback--error" role="alert">{error}</p>}{feedback && <p className="profile-saved-message" role="status">{feedback}</p>}<form className="support-request-form" onSubmit={sendSupport}><label>Subject<input required minLength={4} maxLength={140} value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="What do you need help with?" /></label><label>Details<textarea required minLength={15} maxLength={3000} rows={5} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Describe the issue and any steps you already tried." /></label><button className="record-primary-action" type="submit" disabled={busy}><Send size={15} /> {busy ? "Sending…" : "Send request"}</button></form></section>
    <section className="portal-card support-faq"><h2>Your support requests</h2>{tickets.length ? tickets.map((ticket) => <article className="support-ticket" key={ticket._id}><div><strong>{ticket.subject}</strong><span>{new Date(ticket.createdAt).toLocaleString()}</span></div><span className="record-status">{ticket.status.replace("_", " ")}</span><p>{ticket.message}</p>{ticket.response && <p><strong>Help desk response:</strong> {ticket.response}</p>}</article>) : <p>No support requests yet.</p>}</section>
    <section className="portal-card support-faq"><h2>Common questions</h2><details><summary>How do I report a found item?</summary><p>Open Report, add a clear description and location, then submit the item record.</p></details><details><summary>How do I claim an item?</summary><p>Find the matching record in Matches and submit a claim with your signed-in university account.</p></details><details><summary>Where can I check a claim's status?</summary><p>Open Notifications for updates about item matches, custody, and claims.</p></details></section>
  </PortalShell>;
}

function useRouteItem() {
  const state = useLocation().state || {};
  const itemId = state.item?.registryId || state.item?.id || state.id || "REG-8494";
  const [item, setItem] = useState(state.item || null); const [error, setError] = useState("");
  useEffect(() => { let active = true; apiRequest(`/items/${encodeURIComponent(itemId)}`).then((result) => { if (active) setItem(result.item); }).catch((cause) => { if (active) setError(cause.message); }); return () => { active = false; }; }, [itemId]);
  return { itemId, item, error };
}
export function ClaimDetailsPage() {
  const navigate = useNavigate(); const { itemId, item, error } = useRouteItem(); const [claims, setClaims] = useState([]);
  useEffect(() => { apiRequest(`/items/${encodeURIComponent(itemId)}/claims`).then((result) => setClaims(result.claims || [])).catch(() => {}); }, [itemId]);
  return <PortalShell><button className="portal-back" onClick={() => window.history.back()} type="button"><ArrowLeft size={16} /> Back</button><div className="portal-heading"><span className="portal-eyebrow"><ClipboardCheck size={16} /> OWNERSHIP REVIEW</span><h1>Item &amp; Claim Details</h1><p>Current registry information and your claim status.</p></div>
    {error && <p className="portal-feedback portal-feedback--error" role="alert">{error}</p>}{item && <section className="portal-card record-detail-card"><div className="record-detail-top"><div className="support-icon"><ClipboardCheck size={22} /></div><span className="record-status"><Clock3 size={14} /> {item.status}</span></div><span className="record-id">#{item.registryId || itemId}</span><h2>{item.title}</h2><p>{item.description || "No additional description supplied."}</p>{item.images?.length > 0 && <div className="detail-image-grid">{item.images.map((image, index) => <img key={index} src={image.dataUrl} alt={`${item.title} ${index + 1}`} />)}</div>}<div className="record-detail-meta"><div><span>Category</span><strong>{item.category}</strong></div><div><span>Found at</span><strong><MapPin size={15} /> {item.location}</strong></div><div><span>Color</span><strong>{item.color}</strong></div><div><span>Reported date</span><strong>{item.date}</strong></div></div>
      {claims.map((claim) => <div className="claim-status-row" key={claim._id || claim.id}><strong>Your claim: {claim.status}</strong><span>{claim.reviewNote || "Waiting for staff review."}</span></div>)}{item.status !== "Released" && item.status !== "Archived" && <button type="button" className="record-primary-action" onClick={() => navigate("/claim", { state: { id: item.registryId || itemId, item } })}>Continue to secure claim</button>}<button type="button" className="record-secondary-action" onClick={() => navigate("/custody-log", { state: { id: item.registryId || itemId, item } })}>View custody log</button>
    </section>}</PortalShell>;
}

export function CustodyLogPage() {
  const navigate = useNavigate(); const { itemId, item: routeItem } = useRouteItem(); const [item, setItem] = useState(routeItem); const [events, setEvents] = useState([]); const [error, setError] = useState(""); const [form, setForm] = useState({ event: "Item checked into custody", location: "", locker: "", status: "In Storage", notes: "" }); const [busy, setBusy] = useState(false);
  const user = readUser(); const canRecord = ["staff", "admin"].includes(user?.role);
  const load = () => apiRequest(`/items/${encodeURIComponent(itemId)}/custody`).then((result) => { setItem(result.item); setEvents(result.events || []); }).catch((cause) => setError(cause.message));
  useEffect(() => { load(); }, [itemId]);
  const recordEvent = async (event) => { event.preventDefault(); setBusy(true); setError(""); try { await apiRequest(`/items/${encodeURIComponent(itemId)}/custody`, { method: "POST", body: JSON.stringify(form) }); setForm({ event: "", location: "", locker: "", status: "In Storage", notes: "" }); await load(); } catch (cause) { setError(cause.message); } finally { setBusy(false); } };
  return <PortalShell><button className="portal-back" onClick={() => window.history.back()} type="button"><ArrowLeft size={16} /> Back</button><div className="portal-heading"><span className="portal-eyebrow"><LockKeyhole size={16} /> SECURE CUSTODY RECORD</span><h1>Custody Log</h1><p>Database-recorded custody events for this FindHub item.</p></div>
    {error && <p className="portal-feedback portal-feedback--error" role="alert">{error}</p>}{item && <section className="portal-card record-detail-card"><div className="record-detail-top"><div className="support-icon"><LockKeyhole size={22} /></div><span className="record-status"><ShieldCheck size={14} /> {item.status}</span></div><span className="record-id">#{item.registryId || itemId}</span><h2>{item.title}</h2><p>{item.location} · {item.category}</p>
      {events.length ? <ol className="custody-timeline">{events.map((entry) => <li key={entry._id}><strong>{entry.event}</strong><span>{entry.location}{entry.locker ? ` · Locker ${entry.locker}` : ""} · {entry.status}</span><small>{entry.recordedBy} · {new Date(entry.createdAt).toLocaleString()}</small>{entry.notes && <small>{entry.notes}</small>}</li>)}</ol> : <p>No custody events have been recorded yet.</p>}
      {canRecord && <form className="support-request-form custody-form" onSubmit={recordEvent}><h3>Record custody event</h3><label>Event<input required maxLength={120} value={form.event} onChange={(event) => setForm({ ...form, event: event.target.value })} /></label><label>Location<input required maxLength={180} value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} /></label><label>Locker (optional)<input maxLength={80} value={form.locker} onChange={(event) => setForm({ ...form, locker: event.target.value })} /></label><label>Updated status<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}><option>In Storage</option><option>Claim In Progress</option><option>Released</option><option>Archived</option></select></label><label>Notes<textarea maxLength={1000} value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} /></label><button className="record-primary-action" disabled={busy}>{busy ? "Saving…" : "Save custody event"}</button></form>}
      <button type="button" className="record-secondary-action" onClick={() => navigate("/claim-details", { state: { id: item.registryId || itemId, item } })}>View claims</button>
    </section>}</PortalShell>;
}

export function AdminClaimsPage() {
  const [claims, setClaims] = useState([]); const [error, setError] = useState(""); const [busyId, setBusyId] = useState(""); const [note, setNote] = useState("");
  const load = () => apiRequest("/admin/claims").then((result) => setClaims(result.claims || [])).catch((cause) => setError(cause.message));
  useEffect(() => { load(); }, []);
  const review = async (claim, status) => { setBusyId(claim._id); setError(""); try { await apiRequest(`/admin/claims/${claim._id}`, { method: "PATCH", body: JSON.stringify({ status, reviewNote: note }) }); setNote(""); await load(); } catch (cause) { setError(cause.message); } finally { setBusyId(""); } };
  return <PortalShell><button className="portal-back" onClick={() => window.history.back()} type="button"><ArrowLeft size={16} /> Back</button><div className="portal-heading"><span className="portal-eyebrow"><ClipboardCheck size={16} /> STAFF WORKSPACE</span><h1>Claim Review Queue</h1><p>Approve or reject campus claims after manual identity and item verification.</p></div>{error && <p className="portal-feedback portal-feedback--error" role="alert">{error}</p>}
    {claims.length === 0 && !error && <section className="portal-card record-detail-card">No claims are waiting for review.</section>}{claims.map((claim) => <article className="portal-card admin-claim-card" key={claim._id}><div className="record-detail-top"><span className="record-id">#{claim.itemId}</span><span className="record-status">{claim.status}</span></div><h2>{claim.item?.title || claim.itemId} · {claim.role}</h2><p><strong>Claimant:</strong> {claim.email} · {claim.phone}</p><p>{claim.narrative}</p><label className="admin-review-note">Review note<input value={note} maxLength={1000} onChange={(event) => setNote(event.target.value)} placeholder="Optional note to claimant" /></label><div className="admin-review-actions"><button className="record-primary-action" disabled={busyId === claim._id} onClick={() => review(claim, "approved")}>Approve</button><button className="profile-cancel-button" disabled={busyId === claim._id} onClick={() => review(claim, "rejected")}>Reject</button></div></article>)}</PortalShell>;
}

export function AdminSupportPage() {
  const [tickets, setTickets] = useState([]); const [error, setError] = useState(""); const [busyId, setBusyId] = useState(""); const [responses, setResponses] = useState({});
  const load = () => apiRequest("/admin/support").then((result) => setTickets(result.tickets || [])).catch((cause) => setError(cause.message));
  useEffect(() => { load(); }, []);
  const update = async (ticket, status) => { setBusyId(ticket._id); setError(""); try { const result = await apiRequest(`/admin/support/${ticket._id}`, { method: "PATCH", body: JSON.stringify({ status, response: responses[ticket._id] || "" }) }); setTickets((current) => current.map((entry) => entry._id === ticket._id ? result.ticket : entry)); } catch (cause) { setError(cause.message); } finally { setBusyId(""); } };
  return <PortalShell><button className="portal-back" onClick={() => window.history.back()} type="button"><ArrowLeft size={16} /> Back</button><div className="portal-heading"><span className="portal-eyebrow"><CircleHelp size={16} /> STAFF WORKSPACE</span><h1>Support Request Queue</h1><p>Review and respond to saved user support requests.</p></div>{error && <p className="portal-feedback portal-feedback--error" role="alert">{error}</p>}{tickets.length === 0 && !error && <section className="portal-card record-detail-card">No support requests yet.</section>}
    {tickets.map((ticket) => <article className="portal-card admin-claim-card" key={ticket._id}><div className="record-detail-top"><span className="record-id">{ticket.email}</span><span className="record-status">{ticket.status.replace("_", " ")}</span></div><h2>{ticket.subject}</h2><p>{ticket.message}</p><label className="admin-review-note">Reply to user<textarea rows={3} maxLength={2000} value={responses[ticket._id] ?? ticket.response ?? ""} onChange={(event) => setResponses({ ...responses, [ticket._id]: event.target.value })} /></label><div className="admin-review-actions"><button className="record-primary-action" disabled={busyId === ticket._id} onClick={() => update(ticket, "in_progress")}>Save as in progress</button><button className="record-secondary-action" disabled={busyId === ticket._id} onClick={() => update(ticket, "resolved")}>Resolve request</button></div></article>)}
  </PortalShell>;
}
