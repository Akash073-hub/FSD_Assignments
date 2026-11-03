import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiRequest } from "./api";
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
  const [category, setCategory] = useState("All Categories");
  const [location, setLocation] = useState("Everywhere");
  const [dateWindow, setDateWindow] = useState("Past 7 Days");
  const [stats, setStats] = useState({ totalTracked: 0, activeCases: 0, inCustody: 0, reunited: 0 });

  useEffect(() => { apiRequest("/dashboard/stats").then(setStats).catch(() => {}); }, []);

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
          <button className="nav-icon-btn" title="Support" onClick={() => navigate("/support")}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>help</span>
          </button>
          <button type="button" className="nav-avatar" aria-label="Open profile" onClick={() => navigate("/profile")}>JS</button>
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
      <main className="page">

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
            <div className="stat-value">{stats.totalTracked.toLocaleString()}</div>
            <div className="stat-sub">
              <TrendingUp size={12} color="#999" />
              Live registry total
            </div>
          </div>

          {/* Active Lost Cases */}
          <div className="stat-card stat-card--bordered">
            <div className="stat-top">
              <span className="stat-label">Active Registry Items</span>
              <span className="badge badge--searching">Open</span>
            </div>
            <div className="stat-value">{stats.activeCases.toLocaleString()}</div>
            <div className="stat-sub">
              <Search size={12} color="#999" />
              Active items in registry
            </div>
          </div>

          {/* At Custody Hubs */}
          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-label">At Custody Hubs</span>
              <span className="badge badge--storage">In Storage</span>
            </div>
            <div className="stat-value">{stats.inCustody.toLocaleString()}</div>
            <div className="stat-sub">
              <CheckCircle size={12} color="#999" />
              <button type="button" className="stat-link" onClick={() => goToSearch()}>Unclaimed items ready</button>
            </div>
          </div>

          {/* Reunited Owners */}
          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-label">Items Released</span>
              <span className="badge badge--rate">Released</span>
            </div>
            <div className="stat-value">{stats.reunited.toLocaleString()}</div>
            <div className="stat-sub">
              <RefreshCw size={12} color="#999" />
              Staff-confirmed releases
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
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option>All Categories</option>
                  <option>Electronics</option>
                  <option>Books &amp; Stationery</option>
                  <option>IDs &amp; Cards</option>
                  <option>Keys &amp; Wallets</option>
                  <option>Bags &amp; Apparel</option>
                  <option>Accessories</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Campus Hub / Location</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option>Everywhere</option>
                  <option>North Campus Hub</option>
                  <option>Main Library Wing</option>
                  <option>Science Complex</option>
                  <option>Engineering Hall</option>
                  <option>Dining Commons</option>
                  <option>Sports Center</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Date Window</label>
                <select
                  value={dateWindow}
                  onChange={(e) => setDateWindow(e.target.value)}
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
              <button className="search-btn" type="button" onClick={() => goToSearch()}>
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
      </main>

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
          <a href="/support" onClick={(event) => { event.preventDefault(); navigate("/support"); }}>Support Center</a>
          <a href="/home">Contact Hub Admin</a>
        </div>
      </footer>
    </>
  );
}
