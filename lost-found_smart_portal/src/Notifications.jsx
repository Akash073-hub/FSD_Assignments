import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Notifications.css";

const Icon = ({ name, filled = false, style = {} }) => (
  <span
    className={`material-symbols-outlined${filled ? " fill-1" : ""}`}
    style={style}
  >
    {name}
  </span>
);

export default function Notifications() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notificationsMuted, setNotificationsMuted] = useState(false);
  const [unreadIds, setUnreadIds] = useState(["ai-match", "custody-wallet", "claim-book"]);
  const [dismissedIds, setDismissedIds] = useState([]);
  const [actionMessage, setActionMessage] = useState("");
  const allRead = unreadIds.length === 0;
  const tabCounts = [
    4 - dismissedIds.length,
    dismissedIds.includes("ai-match") ? 0 : 1,
    dismissedIds.includes("custody-wallet") ? 0 : 1,
    2 - Number(dismissedIds.includes("claim-book")) - Number(dismissedIds.includes("claim-hydro")),
  ];
  const tabLabels = ["All Notifications", "AI Matches", "Custody & Storage", "Claims & Verification"];

  const dismissNotification = (id) => {
    setDismissedIds((current) => [...current, id]);
    setUnreadIds((current) => current.filter((unreadId) => unreadId !== id));
  };

  const openClaimDetails = (id) => {
    navigate("/claim-details", { state: { id, item: { id } } });
  };

  const showCategory = (category) => activeTab === 0 ||
    (activeTab === 1 && category === "ai") ||
    (activeTab === 2 && category === "custody") ||
    (activeTab === 3 && category === "claims");

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* ── NAV ── */}
      <nav className="nf-nav">
        <div className="nf-nav-inner">
          <a href="/home" className="nf-brand">
            <div className="nf-brand-icon">
              <Icon name="school" filled />
            </div>
            <div className="nf-brand-text">
              <div className="nf-brand-row">
                <span className="nf-brand-name">FindHub Portal</span>
                <span className="nf-badge-acad">Academic</span>
              </div>
              <span className="nf-brand-sub">Campus Infrastructure</span>
            </div>
          </a>

          <div className="nf-nav-right">
            <nav className="app-nav-links" aria-label="Primary navigation">
              <button type="button" className="app-nav-link" onClick={() => navigate("/home")}><Icon name="home" /> Home</button>
              <button type="button" className="app-nav-link" onClick={() => navigate("/report-item")}><Icon name="edit_document" /> Report</button>
              <button type="button" className="app-nav-link" onClick={() => navigate("/search")}><Icon name="search" /> Matches</button>
            </nav>
            <div className="nf-nav-actions">
              <button className="nf-icon-btn" title="Notifications">
                <Icon name="notifications" filled />
              {unreadIds.length > 0 && !notificationsMuted && <span className="nf-notif-badge">{unreadIds.length}</span>}
              </button>
              <button className="nf-help-btn" title="Support" onClick={() => navigate("/support")}>
                <Icon name="help" />
              </button>
              <div className="nf-sep" />
              <button type="button" className="nf-avatar" aria-label="Open profile" onClick={() => navigate("/profile")}>JS</button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── GOLD SUB BAR ── */}
      <div className="nf-subbar">
        <div className="nf-subbar-inner">
          <div className="nf-subbar-left">
            <span className="nf-subbar-dot" />
            FindHub Registry • Notifications &amp; Custody Dispatch
          </div>
          <div className="nf-subbar-right">
            <Icon name="shield" />
            Institutional Security &amp; Custody Division
          </div>
        </div>
      </div>

      {/* ── PAGE ── */}
      <main className="nf-page" style={{ flex: 1 }}>

        {/* Breadcrumb */}
        <nav className="nf-breadcrumb">
          <a href="/home"><Icon name="home" /> Home</a>
          <span className="sep">/</span>
          <span className="cur">Notifications</span>
        </nav>

        {/* Page header */}
        <div className="nf-page-header">
          <h1>Notifications</h1>
          <p>Real-time chain-of-custody alerts, AI match detections, and claim status updates across campus hubs.</p>
        </div>

        {/* Alert bar */}
        <div className="nf-alert-bar">
          <div className="nf-alert-bar-left">
            <span className={`nf-unread-pill${allRead ? " nf-unread-pill--clear" : ""}`}>
              <span className="nf-unread-dot" />
              {allRead ? "All Caught Up" : notificationsMuted ? "Notifications Muted" : `${unreadIds.length} Unread Alerts`}
            </span>
            <span className="nf-sync-text">Last synchronized 2 minutes ago via Central Campus Node</span>
          </div>
          <div className="nf-alert-bar-right">
            <button className="nf-btn-outline" type="button" onClick={() => setUnreadIds([])} disabled={allRead}>
              <Icon name="done_all" style={{ fontSize: 14 }} />
              Mark All as Read
            </button>
            <button className="nf-btn-dark" type="button" onClick={() => setSettingsOpen(true)}>
              <Icon name="settings" style={{ fontSize: 14 }} />
              Notification Settings
            </button>
          </div>
        </div>

        {settingsOpen && (
          <div className="nf-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSettingsOpen(false); }}>
            <section className="nf-settings-modal" role="dialog" aria-modal="true" aria-labelledby="nf-settings-title">
              <button type="button" className="nf-modal-close" aria-label="Close notification settings" onClick={() => setSettingsOpen(false)}>×</button>
              <span className="nf-modal-icon"><Icon name="notifications_active" /></span>
              <h2 id="nf-settings-title">Notification Settings</h2>
              <p>Choose whether FindHub can send alerts about item matches, custody updates, and claims.</p>
              <div className="nf-setting-options">
                <button type="button" className={!notificationsMuted ? "selected" : ""} onClick={() => setNotificationsMuted(false)}>
                  <span><Icon name="notifications_active" /><strong>Unmute notifications</strong></span>
                  <small>Receive all FindHub alerts</small>
                </button>
                <button type="button" className={notificationsMuted ? "selected" : ""} onClick={() => setNotificationsMuted(true)}>
                  <span><Icon name="notifications_off" /><strong>Mute all notifications</strong></span>
                  <small>Pause alerts until you unmute them</small>
                </button>
              </div>
              <button type="button" className="nf-settings-done" onClick={() => setSettingsOpen(false)}>Done</button>
            </section>
          </div>
        )}

        {actionMessage && <div className="nf-action-message" role="status">{actionMessage}<button type="button" aria-label="Dismiss message" onClick={() => setActionMessage("")}>×</button></div>}

        {/* Tabs */}
        <div className="nf-tabs">
          {tabLabels.map((tab, i) => (
            <button
              key={i}
              className={`nf-tab${activeTab === i ? " active" : ""}`}
              onClick={() => setActiveTab(i)}
            >
              {tab} ({tabCounts[i]})
            </button>
          ))}
        </div>

        {/* Main grid — cards fill left, sidebar on right */}
        <div className="nf-grid">

          {/* ── LEFT: Notification Cards ── */}
          <div className="nf-cards">

            {/* Card 1: AI Match */}
            {showCategory("ai") && !dismissedIds.includes("ai-match") && <div className={`nf-card${unreadIds.includes("ai-match") ? "" : " nf-card--read"}`}>
              <div className="nf-card-body">
                <div className="nf-card-icon nf-card-icon--gold">
                  <Icon name="auto_awesome" filled />
                </div>
                <div className="nf-card-content">
                  <div className="nf-card-top">
                    <h2 className="nf-card-title">
                      AI Match Detected: Apple AirPods Pro (2nd Gen)
                    </h2>
                    <span className="nf-status-badge nf-status-badge--gold">Match Pending Review</span>
                  </div>
                  <p className="nf-card-body-text">
                    Algorithmic visual and serial analysis scored an exceptional{" "}
                    <strong>98.4% match confidence</strong> with lost item report{" "}
                    <span className="mono-inline">#REG-8492</span>. Currently held in secure custody at Main
                    Library Locker <strong>#LIB-302-A</strong>.
                  </p>
                  <div className="nf-card-footer">
                    <span className="nf-card-meta">
                      <Icon name="schedule" />
                      Detected 14 mins ago • Automated Vision Engine v4.2
                    </span>
                    <div className="nf-card-actions">
                      <button className="nf-btn-ghost" onClick={() => dismissNotification("ai-match")}>Dismiss</button>
                      <button className="nf-btn-gold" onClick={() => navigate("/search", { state: { query: "Apple AirPods Pro" } })}>
                        <Icon name="compare" style={{ fontSize: 14 }} />
                        Review Match &amp; Compare Photos
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>}

            {/* Card 2: Custody Check-In */}
            {showCategory("custody") && !dismissedIds.includes("custody-wallet") && <div className={`nf-card nf-card--gray${unreadIds.includes("custody-wallet") ? "" : " nf-card--read"}`}>
              <div className="nf-card-body">
                <div className="nf-card-icon nf-card-icon--gray">
                  <Icon name="lock" />
                </div>
                <div className="nf-card-content">
                  <div className="nf-card-top">
                    <h2 className="nf-card-title">
                      Custody Check-In: Black Leather Bifold Wallet{" "}
                      <span className="mono">(#REG-8493)</span>
                    </h2>
                    <span className="nf-status-badge nf-status-badge--gray">In Storage</span>
                  </div>
                  <p className="nf-card-body-text">
                    Official deposit confirmed by Campus Security Marshal. Item sealed and logged into{" "}
                    <strong>Dining Commons West Custody Locker #DC-104-B</strong>. Contains campus ID
                    badge and non-currency cards.
                  </p>
                  <div className="nf-card-footer">
                    <span className="nf-card-meta">
                      <Icon name="history" />
                      Checked in today at 09:12 AM • Officer S. Vance
                    </span>
                    <div className="nf-card-actions">
                      <button className="nf-btn-bordered" onClick={() => window.print()}>
                        <Icon name="print" style={{ fontSize: 14 }} />
                        Print Custody Receipt
                      </button>
                      <button className="nf-btn-light" onClick={() => navigate("/custody-log", { state: { id: "REG-8493", item: { id: "REG-8493" } } })}>View Custody Log</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>}

            {/* Card 3: Claim Verification */}
            {showCategory("claims") && !dismissedIds.includes("claim-book") && <div className={`nf-card${unreadIds.includes("claim-book") ? "" : " nf-card--read"}`}>
              <div className="nf-card-body">
                <div className="nf-card-icon nf-card-icon--gold">
                  <Icon name="assignment_turned_in" />
                </div>
                <div className="nf-card-content">
                  <div className="nf-card-top">
                    <h2 className="nf-card-title">
                      Claim Verification Request: Calculus: Early Transcendentals{" "}
                      <span className="mono">(#REG-8494)</span>
                    </h2>
                    <span className="nf-status-badge nf-status-badge--gold">Verification Pending</span>
                  </div>
                  <p className="nf-card-body-text">
                    Student <strong>#2024-8831</strong> submitted an ownership dispute with precise
                    handwritten margin note documentation and a matching course receipt timestamp from
                    the university bookstore.
                  </p>
                  <div className="nf-card-footer">
                    <span className="nf-card-meta">
                      <Icon name="person_pin" />
                      Claim submitted 3 hours ago • Department of Mathematics
                    </span>
                    <div className="nf-card-actions">
                      <button className="nf-btn-ghost" onClick={() => setActionMessage("An additional information request was sent for claim #REG-8494.")}>Request Additional Info</button>
                      <button className="nf-btn-dark-sm" onClick={() => openClaimDetails("REG-8494")}>
                        <Icon name="verified" style={{ fontSize: 14 }} />
                        Verify Ownership Claim
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>}

            {/* Card 4: Claim In Progress */}
            {showCategory("claims") && !dismissedIds.includes("claim-hydro") && <div className="nf-card nf-card--gray nf-card--read">
              <div className="nf-card-body">
                <div className="nf-card-icon nf-card-icon--muted">
                  <Icon name="assignment_turned_in" />
                </div>
                <div className="nf-card-content">
                  <div className="nf-card-top">
                    <h2 className="nf-card-title">
                      Claim In Progress: Hydro Flask 32oz (#REG-8496)
                    </h2>
                    <span className="nf-status-badge nf-status-badge--muted">Claim In Progress</span>
                  </div>
                  <p className="nf-card-body-text">
                    A claim for this item is in progress. Review the submitted description and verify the
                    owner’s identity before authorizing release at Sports Center Gym Hub.
                  </p>
                  <div className="nf-card-footer">
                    <span className="nf-card-meta">
                      <Icon name="verified" />
                      Claim submitted today • Sports Center Gym Hub
                    </span>
                    <div className="nf-card-actions">
                      <button className="nf-btn-bordered" onClick={() => openClaimDetails("REG-8496")}>View Claim Details</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>}

          </div>{/* end nf-cards */}

          {/* ── RIGHT: Sidebar ── */}
          <div className="nf-sidebar">

            {/* Summary */}
            <div className="nf-summary-card">
              <div className="nf-summary-header">
                <Icon name="analytics" />
                <h3>Notification Summary</h3>
              </div>
              <div className="nf-summary-rows">
                <div className="nf-summary-row">
                  <span className="nf-summary-label">
                    <span className="nf-dot nf-dot--gold" />
                    AI Match Pending Review
                  </span>
                  <span className="nf-summary-val">1 item</span>
                </div>
                <div className="nf-summary-row">
                  <span className="nf-summary-label">
                    <span className="nf-dot nf-dot--gray" />
                    Under Vault Custody
                  </span>
                  <span className="nf-summary-val">3 items</span>
                </div>
                <div className="nf-summary-row">
                  <span className="nf-summary-label">
                    <span className="nf-dot nf-dot--emerald" />
                    Claims In Progress
                  </span>
                  <span className="nf-summary-val">2 cases</span>
                </div>
              </div>
            </div>

            {/* Chain of custody */}
            <div className="nf-custody-card">
              <div className="nf-custody-header">
                <Icon name="verified_user" />
                <h4>Chain-of-Custody Guarantee</h4>
              </div>
              <p className="nf-custody-text">
                All asset check-ins and handoffs are timestamped cryptographically and verifiable
                against university custody guidelines §4.18.
              </p>
              <button type="button" className="nf-custody-link" onClick={() => navigate("/rules")}>
                Review Protocols
                <Icon name="arrow_forward" style={{ fontSize: 14 }} />
              </button>
            </div>

          </div>
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="nf-footer">
        <div className="nf-footer-inner">
          <div className="nf-footer-brand">
            <div className="nf-footer-icon-wrap">
              <Icon name="school" filled />
            </div>
            <span className="nf-footer-name">FindHub Portal</span>
            <span className="nf-footer-copy">
              © 2024 FindHub Portal • Academic Campus Infrastructure &amp; Custody Division. All rights reserved.
            </span>
          </div>
          <div className="nf-footer-links">
            <button type="button">Institutional Security</button>
            <button type="button">Custody Protocols</button>
            <button type="button">Campus Police Dispatch</button>
            <button type="button">Privacy Poflicy</button>
          </div>
        </div>
      </footer>

    </div>
  );
}
