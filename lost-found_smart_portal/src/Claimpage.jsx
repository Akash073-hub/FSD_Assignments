import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiRequest } from "./api";
import "./Claimpage.css";

// Shared Material Symbols keep icon weight and geometry consistent across pages.
const createIcon = (name, filled = false) => () => (
  <span className={`material-symbols-outlined${filled ? " fill-1" : ""}`} aria-hidden="true">
    {name}
  </span>
);

const Icon = {
  School: createIcon("school", true), Shield: createIcon("shield"), Home: createIcon("home"),
  Notification: createIcon("notifications", true), Help: createIcon("help"), Clock: createIcon("schedule"),
  MapPin: createIcon("location_on"), Badge: createIcon("verified"), Policy: createIcon("verified_user"),
  Verified: createIcon("verified"), Key: createIcon("key"), Lock: createIcon("lock"),
  Security: createIcon("security"), Gavel: createIcon("gavel"), Arrow: createIcon("arrow_forward"),
  Warehouse: createIcon("warehouse"), Phone: createIcon("phone"),
};

export default function ClaimPage({ onConfirm, onCancel, currentUser }) {
  const navigate = useNavigate();
  const location = useLocation();
  let savedUser = null;
  try { savedUser = JSON.parse(window.localStorage.getItem("findhub-user") || "null"); } catch { savedUser = null; }
  const signedInUser = currentUser || savedUser;
  const user = { name: signedInUser?.fullName || "FindHub user", initials: signedInUser?.fullName?.split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "FH", email: signedInUser?.email || "" };
  const itemId = location.state?.item?.registryId || location.state?.item?.id || location.state?.id || "REG-8493";
  const [item, setItem] = useState(location.state?.item || null);

  const [claimRole, setClaimRole] = useState("owner");
  const [email, setEmail] = useState(user.email);
  const [narrative, setNarrative] = useState("");
  const [usn, setUsn] = useState("");
  const [phone, setPhone] = useState("");
  const [altContact, setAltContact] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  useEffect(() => {
    let active = true;
    apiRequest(`/items/${encodeURIComponent(itemId)}`).then((result) => { if (active) setItem(result.item); }).catch((error) => { if (active) setSubmitMessage(error.message); });
    return () => { active = false; };
  }, [itemId]);

  const validate = () => {
    const e = {};
    if (!narrative.trim() || narrative.trim().length < 20)
      e.narrative = "Please describe the circumstances in at least 20 characters.";
    if (!email.endsWith("@rvu.edu.in"))
      e.email = "Must be a valid @rvu.edu.in email.";
    if (!/^\d{10}$/.test(phone.replace(/\s/g, "")))
      e.phone = "Enter a valid 10-digit mobile number.";
    if (!agreed) e.agreed = "You must accept the declaration to proceed.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setIsSubmitting(true);
    setSubmitMessage("");
    try {
      const result = await apiRequest(`/items/${encodeURIComponent(itemId)}/claims`, {
        method: "POST",
        body: JSON.stringify({ role: claimRole, email, narrative, usn, phone, altContact, agreed }),
      });
      setSubmitMessage(`Claim submitted for review. Claim ID: ${result.claim._id || result.claim.id}`);
      if (onConfirm) onConfirm({ claimRole, email, narrative, usn, phone, altContact });
    } catch (error) {
      setSubmitMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="cp-root">
      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="cp-header">
        <div className="cp-header-inner">
          <div className="cp-brand">
            <div className="cp-brand-icon"><Icon.School /></div>
            <div className="cp-brand-text">
              <div className="cp-brand-title">
                FindHub Portal
                <span className="cp-badge">Academic</span>
              </div>
              <div className="cp-brand-sub">Campus Infrastructure · RV University</div>
            </div>
          </div>

          <div className="cp-header-right">
            <nav className="cp-nav app-nav-links" aria-label="Primary navigation">
              <button type="button" className={`app-nav-link${location.pathname === "/home" ? " app-nav-link--active" : ""}`} onClick={() => navigate("/home")}><Icon.Home /> Home</button>
              <button type="button" className={`app-nav-link${location.pathname === "/report-item" ? " app-nav-link--active" : ""}`} onClick={() => navigate("/report-item")}><span className="material-symbols-outlined">edit_document</span> Report</button>
              <button type="button" className={`app-nav-link${location.pathname === "/search" ? " app-nav-link--active" : ""}`} onClick={() => navigate("/search")}><span className="material-symbols-outlined">search</span> Matches</button>
            </nav>
            <div className="cp-divider" aria-hidden="true" />
            <div className="cp-util-cluster">
              <button type="button" className="cp-icon-btn" aria-label="Notifications (4 unread)" onClick={() => navigate("/notifications")}>
                <Icon.Notification />
                <span className="cp-notif-badge" aria-hidden="true">4</span>
              </button>
              <button type="button" className="cp-icon-btn" aria-label="Support" onClick={() => navigate("/support")}>
                <Icon.Help />
              </button>
              <div className="cp-divider" aria-hidden="true" />
              <button type="button" className="cp-user" aria-label={`Open profile for ${user.name}`} onClick={() => navigate("/profile")}>
                <div className="cp-avatar">{user.initials}</div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Sub-bar ─────────────────────────────────────────────── */}
      <div className="cp-subbar" role="banner">
        <div className="cp-subbar-inner">
          <div className="cp-subbar-left">
            <span className="cp-subbar-dot" aria-hidden="true" />
            <span>FindHub Registry</span>
            <span className="cp-subbar-sep" aria-hidden="true">·</span>
            <span>Ownership Verification &amp; Custody Claim</span>
          </div>
          <div className="cp-subbar-right">
            <Icon.Shield />
            Institutional Security &amp; Custody Division
          </div>
        </div>
      </div>

      {/* ── Main ─────────────────────────────────────────────────── */}
      <main className="cp-main">
        {/* Breadcrumb */}
        <nav className="cp-breadcrumb" aria-label="Breadcrumb">
          <a href="/home"><Icon.Home /> Home</a>
          <span aria-hidden="true">/</span>
          <a href="/search">Directory Search</a>
          <span aria-hidden="true">/</span>
          <span className="cp-crumb-code">#{item?.registryId || itemId}</span>
          <span aria-hidden="true">/</span>
          <span className="cp-crumb-active">Verify Ownership</span>
        </nav>

        {/* Page heading */}
        <div className="cp-page-heading">
          <div className="cp-heading-left">
            <div className="cp-eyebrow">
              <Icon.Verified />
              Chain-of-Custody Release Docket
            </div>
            <h1 className="cp-page-title">Ownership Claim &amp; Custody Confirmation</h1>
            <p className="cp-page-desc">
              Review the item details, confirm how or where you lost or found the article,
              and provide your verified institutional contact details for the custody release.
            </p>
          </div>
          <div className="cp-heading-chips">
            <span className="cp-chip cp-chip--secondary">
              <Icon.Gavel /> RVU Code §4.18
            </span>
          </div>
        </div>

        {/* Two-column grid */}
        <div className="cp-grid">
          {/* ── LEFT: Item dossier ─────────────────────────────── */}
          <div className="cp-left">
            {/* Dossier card */}
            <div className="cp-card" aria-label="Item registry record">
              <div className="cp-card-accent" aria-hidden="true" />

              {/* Card header */}
              <div className="cp-dossier-header">
                <div>
                  <div className="cp-dossier-label">Registry Record</div>
                  <div className="cp-dossier-id-row">
                    <span className="cp-reg-code">#{item?.registryId || itemId}</span>
                    <span className="cp-category-tag">{item?.category || "Loading item…"}</span>
                  </div>
                </div>
                <span className="cp-status-pending">
                  <Icon.Clock /> {item?.status || "Loading status…"}
                </span>
              </div>

              {/* Item content */}
              <div className="cp-dossier-body">
                {/* Thumbnail + title */}
                <div className="cp-item-row">
                  <div className="cp-thumb-wrap">
                    {item?.images?.[0]?.dataUrl ? <img src={item.images[0].dataUrl} alt={`${item.title} item photo`} className="cp-thumb-img" /> : <div className="cp-thumb-img cp-thumb-placeholder"><span className="material-symbols-outlined">inventory_2</span></div>}
                    <span className="cp-evid-tag" aria-hidden="true">EVID-1</span>
                  </div>
                  <div className="cp-item-meta">
                    <h2 className="cp-item-title">{item?.title || "Loading item details…"}</h2>
                    <p className="cp-item-desc">{item?.description || "No additional description was provided."}</p>
                    <div className="cp-item-location">
                      <Icon.Warehouse />
                      {item?.location || "Location not available"}
                    </div>
                  </div>
                </div>

                {/* Metadata table */}
                <table className="cp-meta-table" aria-label="Item custody details">
                  <tbody>
                    {[
                      ["Reported date", item?.date || "Loading"],
                      ["Current status", item?.status || "Loading"],
                      ["Category", item?.category || "Loading"],
                      ["Color", item?.color || "Loading"],
                    ].map(([label, value], i) => (
                      <tr key={i} className={i % 2 === 0 ? "cp-meta-row" : "cp-meta-row cp-meta-row--alt"}>
                        <th className="cp-meta-th">{label}</th>
                        <td className="cp-meta-td">
                          {value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Custody notice */}
                <div className="cp-custody-notice" role="note">
                  <Icon.Policy />
                  <p>
                    <strong>Strict Security Handover Protocol:</strong> All item releases
                    require in-person verification with matched institutional credentials
                    at the designated campus hub desk.
                  </p>
                </div>
              </div>

              {/* Card footer */}
              <div className="cp-dossier-footer">
                <span>Holding Period: <strong>14 Days Remaining</strong></span>
                <span className="cp-tag-affixed">Physical Tag Affixed</span>
              </div>
            </div>

            {/* How verification works */}
            <div className="cp-card cp-how-card">
              <div className="cp-how-header">
                <Icon.Verified />
                <span>How verification works</span>
              </div>
              <ol className="cp-how-list">
                <li>Submit distinguishing internal contents known only to the owner.</li>
                <li>Desk Security matches entries against encrypted officer notes.</li>
                <li>Receive an authorized Custody Pickup Token via your RVU email.</li>
                <li>Present university ID at Locker DC-104-B for custody transfer.</li>
              </ol>
            </div>
          </div>

          {/* ── RIGHT: Claim form ──────────────────────────────── */}
          <div className="cp-right">
            <form className="cp-form-card" onSubmit={handleSubmit} noValidate aria-label="Ownership claim form">

              {/* Section 1 */}
              <section className="cp-section" aria-labelledby="sec1-title">
                <div className="cp-section-header">
                  <div className="cp-section-title-row">
                    <span className="cp-step-num" aria-hidden="true">1</span>
                    <h3 id="sec1-title" className="cp-section-title">Ownership Verification Questions</h3>
                  </div>
                  <span className="cp-mandatory-label">* Mandatory fields</span>
                </div>

                {/* Claim role */}
                <fieldset className="cp-field">
                  <legend className="cp-label">Claim relationship</legend>
                  <div className="cp-radio-grid">
                    {[
                      { val: "owner",  main: "I am the rightful owner",       sub: "Misplaced or lost this personal article" },
                      { val: "finder", main: "I found and am surrendering it", sub: "Assisting custody transfer to security" },
                    ].map(({ val, main, sub }) => (
                      <label
                        key={val}
                        className={`cp-radio-card${claimRole === val ? " cp-radio-card--selected" : ""}`}
                      >
                        <input
                          type="radio"
                          name="claim_role"
                          value={val}
                          checked={claimRole === val}
                          onChange={() => setClaimRole(val)}
                          className="cp-radio-input"
                        />
                        <div>
                          <div className="cp-radio-main">{main}</div>
                          <div className="cp-radio-sub">{sub}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </fieldset>

                {/* Narrative */}
                <div className="cp-field">
                  <label className="cp-label" htmlFor="narrative">
                    How or where did you lose/find this item? <span className="cp-required">*</span>
                  </label>
                  <p className="cp-helper">
                    Describe specific distinguishing marks, contents inside (e.g., specific cards,
                    brand stamps, cash denominations), or exact time/circumstance when misplaced.
                  </p>
                  <textarea
                    id="narrative"
                    className={`cp-textarea${errors.narrative ? " cp-input--error" : ""}`}
                    rows={4}
                    placeholder="e.g., Left inside Dining Commons booth table 14 near window. Contains an RVU library card ending in 4102, a metallic transit pass with a scratch on corner, and two folded currency bills. Small silver monogram embossed on lower right flap..."
                    value={narrative}
                    onChange={(e) => {
                      setNarrative(e.target.value);
                      if (errors.narrative) setErrors((p) => ({ ...p, narrative: undefined }));
                    }}
                    required
                  />
                  {errors.narrative && <p className="cp-error" role="alert">{errors.narrative}</p>}
                </div>

                {/* USN */}
                <div className="cp-field">
                  <div className="cp-label-row">
                    <label className="cp-label" htmlFor="usn">Student ID (USN)</label>
                    <span className="cp-hint">Speeds custody release</span>
                  </div>
                  <div className="cp-input-wrap">
                    <span className="cp-input-icon"><Icon.Key /></span>
                    <input
                      id="usn"
                      type="text"
                      className="cp-input"
                      placeholder="Student ID on internal card or manufacturer serial code"
                      value={usn}
                      onChange={(e) => setUsn(e.target.value)}
                      autoComplete="off"
                    />
                  </div>
                </div>
              </section>

              {/* Section 2 */}
              <section className="cp-section" aria-labelledby="sec2-title">
                <div className="cp-section-header">
                  <div className="cp-section-title-row">
                    <span className="cp-step-num" aria-hidden="true">2</span>
                    <h3 id="sec2-title" className="cp-section-title">Contact &amp; Safety Information</h3>
                  </div>
                  <span className="cp-hint">Mandatory for custody release</span>
                </div>

                <div className="cp-two-col">
                  {/* Email */}
                  <div className="cp-field">
                    <label className="cp-label" htmlFor="inst_email">
                      Institutional email <span className="cp-required">*</span>
                    </label>
                    <div className="cp-input-wrap cp-input-wrap--email">
                      <input
                        id="inst_email"
                        type="email"
                        className={`cp-input cp-input--email${errors.email ? " cp-input--error" : ""}`}
                        placeholder="your.name@rvu.edu.in"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                        }}
                        required
                        aria-describedby="email-hint"
                      />
                      <span className="cp-email-suffix" aria-hidden="true">
                        <Icon.Lock /> @rvu.edu.in
                      </span>
                    </div>
                    <p id="email-hint" className="cp-helper">Domain-locked to official RV University credentials.</p>
                    {errors.email && <p className="cp-error" role="alert">{errors.email}</p>}
                  </div>

                  {/* Phone */}
                  <div className="cp-field">
                    <label className="cp-label" htmlFor="contact_phone">
                      Primary mobile <span className="cp-required">*</span>
                    </label>
                    <div className="cp-input-wrap cp-input-wrap--phone">
                      <span className="cp-phone-prefix" aria-label="India country code">+91</span>
                      <div className="cp-phone-icon-wrap">
                        <span className="cp-input-icon"><Icon.Phone /></span>
                        <input
                          id="contact_phone"
                          type="tel"
                          className={`cp-input cp-input--phone${errors.phone ? " cp-input--error" : ""}`}
                          placeholder="Enter 10-digit mobile number"
                          value={phone}
                          onChange={(e) => {
                            setPhone(e.target.value);
                            if (errors.phone) setErrors((p) => ({ ...p, phone: undefined }));
                          }}
                          required
                          aria-describedby="phone-hint"
                          maxLength={11}
                        />
                      </div>
                    </div>
                    <p id="phone-hint" className="cp-helper">For SMS pickup dispatch &amp; verification call.</p>
                    {errors.phone && <p className="cp-error" role="alert">{errors.phone}</p>}
                  </div>
                </div>

                {/* Alternate contact */}
                <div className="cp-field">
                  <label className="cp-label" htmlFor="alt_contact">
                    Alternate / Departmental supervisor contact <span className="cp-optional">(optional)</span>
                  </label>
                  <input
                    id="alt_contact"
                    type="text"
                    className="cp-input"
                    placeholder="e.g. Prof. Ramanathan (Dept. of Computer Science) or Hostel Warden Ext. 402"
                    value={altContact}
                    onChange={(e) => setAltContact(e.target.value)}
                  />
                </div>
              </section>

              {/* Section 3 */}
              <section className="cp-section cp-section--last" aria-labelledby="sec3-title">
                <div className="cp-section-header">
                  <div className="cp-section-title-row">
                    <span className="cp-step-num" aria-hidden="true">3</span>
                    <h3 id="sec3-title" className="cp-section-title">Terms &amp; Custody Declaration</h3>
                  </div>
                </div>

                <div className="cp-declaration-box">
                  <label className="cp-checkbox-label">
                    <input
                      type="checkbox"
                      className="cp-checkbox"
                      checked={agreed}
                      onChange={(e) => {
                        setAgreed(e.target.checked);
                        if (errors.agreed) setErrors((p) => ({ ...p, agreed: undefined }));
                      }}
                      required
                    />
                    <span className="cp-checkbox-text">
                      I declare under <strong>RVU Institutional Code §4.18</strong> that this
                      claim is authentic. False ownership claims or wrongful possession attempts
                      are subject to formal academic disciplinary action, expulsion proceedings,
                      and direct Campus Police referral.
                    </span>
                  </label>
                  {errors.agreed && <p className="cp-error" role="alert">{errors.agreed}</p>}

                  <div className="cp-audit-trail">
                    <Icon.Security />
                    Audit Trail Logged: IP 172.16.48.102 · Authenticated via RVU Central SSO
                  </div>
                </div>
              </section>

              {/* Action bar */}
              <div className="cp-action-bar">
                <button
                  type="button"
                  className="cp-cancel-btn"
                  onClick={onCancel}
                >
                  ← Cancel &amp; return to directory
                </button>
                <button
                  type="submit"
                  className="cp-submit-btn"
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                >
                  {isSubmitting ? (
                    <><span className="cp-spinner" aria-hidden="true" /> Submitting…</>
                  ) : (
                    <>Confirm &amp; Submit Claim <Icon.Arrow /></>
                  )}
                </button>
              </div>
              {submitMessage && <p role="status" aria-live="polite">{submitMessage}</p>}

              {/* Security stamp */}
              <div className="cp-security-stamp">
                <Icon.Lock />
                256-bit Encrypted Chain of Custody Claim · RV University Cyber Infrastructure
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="cp-footer">
        <div className="cp-footer-inner">
          <div className="cp-footer-brand">
            <div className="cp-footer-title">
              <Icon.School /> FindHub Portal
            </div>
            <p className="cp-footer-copy">
              © 2024 FindHub Portal · Academic Campus Infrastructure &amp; Custody Division. All rights reserved.
            </p>
          </div>
          <nav className="cp-footer-nav" aria-label="Footer navigation">
            <a href="/home">Institutional Security</a>
            <a href="/home">Custody Protocols</a>
            <a href="/home">Campus Police Dispatch</a>
            <a href="/home">Privacy Policy</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
