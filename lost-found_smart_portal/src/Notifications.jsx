import React, { useState } from "react";
import "./Notifications.css";

const Icon = ({ name, filled = false, style = {} }) => (
  <span
    className={`material-symbols-outlined${filled ? " fill-1" : ""}`}
    style={style}
  >
    {name}
  </span>
);

const TABS = [
  "All Notifications (12)",
  "AI Matches (3)",
  "Custody & Storage (4)",
  "Claims & Verification (3)",
  "Urgent Deadlines (2)",
];

export default function Notifications() {
  const [activeTab, setActiveTab] = useState(0);

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
            <a href="/home" className="nf-nav-link">
              <Icon name="home" />
              Home
            </a>
            <div className="nf-nav-actions">
              <button className="nf-icon-btn" title="Notifications">
                <Icon name="notifications" filled />
                <span className="nf-notif-badge">4</span>
              </button>
              <button className="nf-help-btn" title="Help">
                <Icon name="help" />
              </button>
              <div className="nf-sep" />
              <div className="nf-avatar">JS</div>
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
            <span className="nf-unread-pill">
              <span className="nf-unread-dot" />
              4 Unread Alerts
            </span>
            <span className="nf-sync-text">Last synchronized 2 minutes ago via Central Campus Node</span>
          </div>
          <div className="nf-alert-bar-right">
            <button className="nf-btn-outline">
              <Icon name="done_all" style={{ fontSize: 14 }} />
              Mark All as Read
            </button>
            <button className="nf-btn-dark">
              <Icon name="settings" style={{ fontSize: 14 }} />
              Notification Settings
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="nf-tabs">
          {TABS.map((tab, i) => (
            <button
              key={i}
              className={`nf-tab${activeTab === i ? " active" : ""}`}
              onClick={() => setActiveTab(i)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Main grid — cards fill left, sidebar on right */}
        <div className="nf-grid">

          {/* ── LEFT: Notification Cards ── */}
          <div className="nf-cards">

            {/* Card 1: AI Match */}
            <div className="nf-card">
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
                    <span className="mono-inline">#REP-4091</span>. Currently held in secure custody at Main
                    Library Locker <strong>#LIB-302-A</strong>.
                  </p>
                  <div className="nf-card-footer">
                    <span className="nf-card-meta">
                      <Icon name="schedule" />
                      Detected 14 mins ago • Automated Vision Engine v4.2
                    </span>
                    <div className="nf-card-actions">
                      <button className="nf-btn-ghost">Dismiss</button>
                      <button className="nf-btn-gold">
                        <Icon name="compare" style={{ fontSize: 14 }} />
                        Review Match &amp; Compare Photos
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Custody Check-In */}
            <div className="nf-card nf-card--gray">
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
                      <button className="nf-btn-bordered">
                        <Icon name="print" style={{ fontSize: 14 }} />
                        Print Custody Receipt
                      </button>
                      <button className="nf-btn-light">View Custody Log</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Claim Verification */}
            <div className="nf-card">
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
                      <button className="nf-btn-ghost">Request Additional Info</button>
                      <button className="nf-btn-dark-sm">
                        <Icon name="verified" style={{ fontSize: 14 }} />
                        Verify Ownership Claim
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: Urgent Deadline */}
            <div className="nf-card nf-card--rose">
              <div className="nf-card-body">
                <div className="nf-card-icon nf-card-icon--rose">
                  <Icon name="timer" filled />
                </div>
                <div className="nf-card-content">
                  <div className="nf-card-top">
                    <h2 className="nf-card-title">
                      Urgent Holding Deadline: Dell XPS 15 Charger{" "}
                      <span className="mono">(#REG-8495)</span>
                    </h2>
                    <span className="nf-status-badge nf-status-badge--rose">Expiring Soon</span>
                  </div>
                  <p className="nf-card-body-text">
                    This asset is approaching its mandatory 30-day campus retention ceiling in{" "}
                    <span className="rose">5 days</span>. Upon term expiry, custody protocol delegates
                    transfer to Institutional Surplus Operations or environmental recycling.
                  </p>
                  <div className="nf-card-footer">
                    <span className="nf-card-meta nf-card-meta--rose">
                      <Icon name="warning" />
                      Deadline: October 28, 2024 at 17:00 EST
                    </span>
                    <div className="nf-card-actions">
                      <button className="nf-btn-bordered">Approve Surplus Transfer</button>
                      <button className="nf-btn-light">Extend Holding Period</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 5: Case Resolved */}
            <div className="nf-card nf-card--muted">
              <div className="nf-card-body">
                <div className="nf-card-icon nf-card-icon--muted">
                  <Icon name="check_circle" />
                </div>
                <div className="nf-card-content">
                  <div className="nf-card-top">
                    <h2 className="nf-card-title nf-card-title--muted">
                      Case Resolved: Hydro Flask 32oz (#REG-8496)
                    </h2>
                    <span className="nf-status-badge nf-status-badge--muted">Reunited</span>
                  </div>
                  <p className="nf-card-body-text">
                    Discharged from locker <strong style={{ color: "#374151" }}>#GYM-012</strong>.
                    Verified student identity via digital credential card and signed digital discharge
                    waiver at Sports Center Gym Hub.
                  </p>
                  <div className="nf-card-footer">
                    <span className="nf-card-meta">
                      <Icon name="verified" />
                      Closed yesterday at 16:45 PM • Attendant R. Kim
                    </span>
                    <div className="nf-card-actions">
                      <button className="nf-btn-bordered">View Resolution Audit</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

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
                    AI Pending Verification
                  </span>
                  <span className="nf-summary-val">3 items</span>
                </div>
                <div className="nf-summary-row">
                  <span className="nf-summary-label">
                    <span className="nf-dot nf-dot--gray" />
                    Under Vault Custody
                  </span>
                  <span className="nf-summary-val">4 items</span>
                </div>
                <div className="nf-summary-row">
                  <span className="nf-summary-label">
                    <span className="nf-dot nf-dot--rose" />
                    Urgent Expiration Deadlines
                  </span>
                  <span className="nf-summary-val nf-summary-val--rose">2 items</span>
                </div>
                <div className="nf-summary-row">
                  <span className="nf-summary-label">
                    <span className="nf-dot nf-dot--emerald" />
                    Reunited This Week
                  </span>
                  <span className="nf-summary-val">8 cases</span>
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
              <button type="button" className="nf-custody-link">
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