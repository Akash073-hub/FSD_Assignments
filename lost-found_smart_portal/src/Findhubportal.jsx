import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Findhubportal.css";
import {
  Search,
  Shield,
  TrendingUp,
  CheckCircle,
  RefreshCw,
  PlusCircle,
  AlignJustify,
} from "lucide-react";

export default function FindHubPortal() {
  const navigate = useNavigate();
  const routeLocation = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All Categories (6)");
  const [location, setLocation] = useState("Everywhere (All Hubs)");
  const [dateWindow, setDateWindow] = useState("Past 7 Days");

  const goToSearch = (query, nextFilters = {}) => {
    const queryText = typeof query === "string" ? query : searchQuery;
    const trimmedQuery = queryText.trim();
    navigate("/search", {
      state: {
        query: trimmedQuery,
        category: nextFilters.category ?? category,
        location: nextFilters.location ?? location,
        dateWindow: nextFilters.dateWindow ?? dateWindow,
      },
    });
  };

  return (
    <>
      {/* ── TOP NAV ── */}
      <nav className="nav">
        <div className="nav-logo">
          <div className="nav-logo-box">
            <span className="material-symbols-outlined nav-logo-icon" style={{ fontVariationSettings: "'FILL' 1", fontSize: 22 }}>school</span>
          </div>
          <div className="nav-logo-text">
            <div className="nav-logo-title">
              <span>FindHub Portal</span>
              <span className="badge-academic">Academic</span>
            </div>
            <div className="nav-subtitle">Campus Infrastructure</div>
          </div>
        </div>

        <div className="nav-center app-nav-links" aria-label="Primary navigation">
          <button type="button" className={`app-nav-link${routeLocation.pathname === "/home" ? " app-nav-link--active" : ""}`} onClick={() => navigate("/home")}>
            <span className="material-symbols-outlined">home</span> Home
          </button>
          <button type="button" className={`app-nav-link${routeLocation.pathname === "/report-item" ? " app-nav-link--active" : ""}`} onClick={() => navigate("/report-item")}>
            <span className="material-symbols-outlined">edit_document</span> Report
          </button>
          <button type="button" className={`app-nav-link${routeLocation.pathname === "/search" ? " app-nav-link--active" : ""}`} onClick={() => navigate("/search")}>
            <span className="material-symbols-outlined">search</span> Matches
          </button>
        </div>

        <div className="nav-right">
          <button className="nav-icon-btn" title="Notifications" onClick={() => navigate("/notifications")}>
            <span className="material-symbols-outlined">notifications</span>
            <span className="nav-notif-dot" />
          </button>
          <button className="nav-icon-btn" title="Rules and safety" onClick={() => navigate("/rules")}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>help</span>
          </button>
          <div className="nav-avatar">JS</div>
        </div>
      </nav>

      {/* ── SUB BAR ── */}
      <div className="sub-bar">
        <span className="sub-left">• &nbsp;FindHub Registry</span>
        <span className="sub-right">
          <Shield size={10} />
          Institutional Security &amp; Custody Division
        </span>
      </div>

      {/* ── PAGE ── */}
      <div className="page">

        {/* HERO */}
        <div className="hero">
          <div className="hero-left">
            <div className="hero-accent" />
            <h1>Community Lost &amp; Found Hub</h1>
            <p>
              Smart Item Tracking &amp; Matching across 42 campus buildings,
              library wings, and dining hubs.
            </p>
          </div>
          <div className="hub-protocol">
            <Shield size={20} color="#C9A84C" />
            <div className="hub-protocol-text">
              <small>Hub Protocol</small>
              <strong>Secure ID and Items</strong>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="stats">

          {/* Total Tracked */}
          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-label">Total Tracked</span>
              <div className="stat-icon-box">
                <AlignJustify size={12} color="#999" />
              </div>
            </div>
            <div className="stat-value">1,428</div>
            <div className="stat-sub">
              <TrendingUp size={12} color="#999" />
              <strong>+12% this week</strong>&nbsp;in circulation
            </div>
          </div>

          {/* Active Lost Cases */}
          <div className="stat-card stat-card--bordered">
            <div className="stat-top">
              <span className="stat-label">Active Lost Cases</span>
              <span className="badge badge--searching">Searching</span>
            </div>
            <div className="stat-value">384</div>
            <div className="stat-sub">
              <Search size={12} color="#999" />
              Avg resolution: 18 hours
            </div>
          </div>

          {/* At Custody Hubs */}
          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-label">At Custody Hubs</span>
              <span className="badge badge--storage">In Storage</span>
            </div>
            <div className="stat-value">219</div>
            <div className="stat-sub">
              <CheckCircle size={12} color="#999" />
              <span className="stat-link">Unclaimed items ready</span>
            </div>
          </div>

          {/* Reunited Owners */}
          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-label">Reunited Owners</span>
              <span className="badge badge--rate">87% Rate</span>
            </div>
            <div className="stat-value">825</div>
            <div className="stat-sub">
              <RefreshCw size={12} color="#999" />
              Verified returns complete
            </div>
          </div>

        </div>

        {/* PANELS */}
        <div className="panels">

          {/* Search Panel */}
          <div className="panel">
            <div className="panel-header">
              <div>
                <div className="panel-eyebrow">
                  <Search size={9} />
                  Fast Directory Search
                </div>
                <h2>Search &amp; Find Matches</h2>
                <p>
                  Look up missing belongings across university halls, transit,
                  and public venues.
                </p>
              </div>
              {/* Search icon button → goes to search page */}
              <button className="panel-icon-btn" onClick={() => goToSearch()} title="Go to search" type="button">
                <Search size={15} color="#999" />
              </button>
            </div>

            {/* Clicking the search input also navigates */}
            <div className="search-box">
              <Search
                size={13}
                className="search-icon"
                onClick={() => goToSearch()}
                style={{ cursor: "pointer" }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") goToSearch(e.currentTarget.value);
                }}
                placeholder="Search keyword: MacBook Pro, blue hydro flask, black leather wallet..."
              />
            </div>

            <div className="filter-row">
              <div className="filter-group">
                <label>Category</label>
                {/* Selecting a category navigates to search */}
                <select
                  value={category}
                  onChange={(e) => {
                    const nextCategory = e.target.value;
                    setCategory(nextCategory);
                    goToSearch(searchQuery, { category: nextCategory });
                  }}
                >
                  <option>All Categories (6)</option>
                  <option>Electronics</option>
                  <option>Clothing</option>
                  <option>Accessories</option>
                  <option>Documents</option>
                  <option>Keys</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Campus Hub / Location</label>
                <select
                  value={location}
                  onChange={(e) => {
                    const nextLocation = e.target.value;
                    setLocation(nextLocation);
                    goToSearch(searchQuery, { location: nextLocation });
                  }}
                >
                  <option>Everywhere (All Hubs)</option>
                  <option>Main Library</option>
                  <option>Dining Hall A</option>
                  <option>Science Block</option>
                  <option>Admin Building</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Date Window</label>
                <select
                  value={dateWindow}
                  onChange={(e) => {
                    const nextDateWindow = e.target.value;
                    setDateWindow(nextDateWindow);
                    goToSearch(searchQuery, { dateWindow: nextDateWindow });
                  }}
                >
                  <option>Past 7 Days</option>
                  <option>Past 30 Days</option>
                  <option>Past 3 Months</option>
                  <option>All Time</option>
                </select>
              </div>
            </div>

            <hr className="divider" />

            {/* Main CTA → navigates to search */}
            <div className="search-btn-row">
              <button className="search-btn" onClick={goToSearch}>
                Search Reported Items
                <span className="search-btn-badge">603 Items</span>
              </button>
            </div>
          </div>

          {/* Report Panel */}
          <div className="panel panel--report">
            <div className="panel-header">
              <div>
                <div className="panel-eyebrow">
                  <PlusCircle size={9} />
                  Contribution Portal
                </div>
                <h2>Report New Item</h2>
                <p>
                  Submit a fast item report with smart image matching to notify
                  owners instantly.
                </p>
              </div>
              <div className="panel-icon-btn">
                <AlignJustify size={14} color="#999" />
              </div>
            </div>

            <div className="info-notice">
              <Shield
                size={15}
                color="#C9A84C"
                style={{ flexShrink: 0, marginTop: 1 }}
              />
              <p>
                Reports are authenticated against campus access logs for
                seamless recovery and claim auditing.
              </p>
            </div>

            <button className="report-btn" onClick={() => navigate("/report-item")}>
              <PlusCircle size={16} />
              + Report Item
            </button>
          </div>

        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-left">
          <span className="material-symbols-outlined footer-logo-icon" style={{ fontVariationSettings: "'FILL' 1", fontSize: 20 }}>school</span>
          <span className="footer-brand">FindHub Portal</span>
          <span className="footer-copy">
            © 2024 FindHub Campus Infrastructure. All rights reserved.
          </span>
        </div>
        <div className="footer-links">
          <a href="/home">Privacy Policy</a>
          <a href="/home">Terms of Service</a>
          <a href="/home">Campus Safety</a>
          <a href="/home">Support Center</a>
          <a href="/home">Contact Hub Admin</a>
        </div>
      </footer>
    </>
  );
}