import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiRequest } from "./api";
import "./Searchpage.css";

const ITEMS = [
  {
    id: "REG-8492", category: "Electronics", categoryColor: "cat-electronics",
    title: "Apple AirPods Pro (2nd Gen)",
    desc: "Case engraved with initials 'MR'. White MagSafe case in mint condition.",
    location: "Main Library Wing (Floor 3)", date: "Oct 24, 2024",
    status: "In Storage", statusColor: "status-green",
    btnLabel: "View Details & Claim", btnClass: "btn-dark",
  },
  {
    id: "REG-8493", category: "IDs & Wallets", categoryColor: "cat-neutral",
    title: "Black Leather Bifold Wallet",
    desc: "Contains student ID & transit pass. Bellroy brand, textured grain leather.",
    location: "Dining Commons West", date: "Oct 23, 2024",
    status: "Verification Pending", statusColor: "status-yellow",
    btnLabel: "Verify Ownership", btnClass: "btn-gold",
  },
  {
    id: "REG-8494", category: "Books & Stationery", categoryColor: "cat-purple",
    title: "Calculus: Early Transcendentals (9th Ed)",
    desc: "Hardcover with blue ribbon bookmark. Stewart Calculus with marginal study notes.",
    location: "Science Complex Room 204", date: "Oct 22, 2024",
    status: "In Storage", statusColor: "status-green",
    btnLabel: "View Details & Claim", btnClass: "btn-dark",
  },
  {
    id: "REG-8495", category: "Electronics", categoryColor: "cat-electronics",
    title: "Dell XPS 15 Charger (130W USB-C)",
    desc: "Black braided cable with white identification tag. Official OEM Dell adapter.",
    location: "Engineering Lab B", date: "Oct 24, 2024",
    status: "In Storage", statusColor: "status-green",
    btnLabel: "View Details & Claim", btnClass: "btn-dark",
  },
  {
    id: "REG-8496", category: "Accessories", categoryColor: "cat-neutral",
    title: "Hydro Flask 32oz Wide Mouth (Cobalt Blue)",
    desc: "Has silver university crest sticker and rubberized boot on base. Flex cap strap intact.",
    location: "Sports Center Gym", date: "Oct 21, 2024",
    status: "Claim In Progress", statusColor: "status-yellow",
    btnLabel: "View Details & Claim", btnClass: "btn-dark",
  },
  {
    id: "REG-8497", category: "Electronics", categoryColor: "cat-electronics",
    title: "JBL Tune 510BT Wireless Headphones",
    desc: "Matte black finish, minimal wear. Foldable on-ear form factor, serial ends in '901'.",
    location: "Student Union Lounge", date: "Oct 20, 2024",
    status: "In Storage", statusColor: "status-green",
    btnLabel: "View Details & Claim", btnClass: "btn-dark",
  },
  {
    id: "REG-8498", category: "Keys & Wallets", categoryColor: "cat-neutral",
    title: "Keys on Red RVU Lanyard",
    desc: "3 brass keys with black automotive key fob and mini flashlight carabiner.",
    location: "North Campus Gate 2", date: "Oct 24, 2024",
    status: "In Storage", statusColor: "status-green",
    btnLabel: "View Details & Claim", btnClass: "btn-dark",
  },
  {
    id: "REG-8499", category: "Bags & Apparel", categoryColor: "cat-purple",
    title: "North Face Borealis Backpack (Navy)",
    desc: "Left on bench near shuttle stop. Contains course binders and spiral notebooks.",
    location: "Transit Pavilion", date: "Oct 19, 2024",
    status: "In Storage", statusColor: "status-green",
    btnLabel: "View Details & Claim", btnClass: "btn-dark",
  },
];

export default function SearchPage() {
  const navigate = useNavigate();
  const routeLocation = useLocation();
  const searchState = routeLocation.state || {};
  const [directoryItems, setDirectoryItems] = useState(ITEMS);
  const [apiMessage, setApiMessage] = useState("");
  const [search, setSearch] = useState(searchState.query || "");
  const [category, setCategory] = useState(searchState.category || "All Categories");
  const [location, setLocation] = useState(searchState.location || "Everywhere");
  const [dateWindow, setDateWindow] = useState(searchState.dateWindow || "All Time");

  useEffect(() => {
    let active = true;
    apiRequest("/items")
      .then(({ items = [] }) => {
        if (!active) return;
        const categoryClass = (value) => value === "Electronics" ? "cat-electronics" : ["Books & Stationery", "Bags & Apparel"].includes(value) ? "cat-purple" : "cat-neutral";
        const dateLabel = (value) => {
          const parsed = new Date(`${value}T00:00:00`);
          return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        };
        setDirectoryItems(items.map((item) => ({
          ...item,
          desc: item.description,
          date: dateLabel(item.date),
          categoryColor: categoryClass(item.category),
          statusColor: item.status === "In Storage" ? "status-green" : "status-yellow",
          btnLabel: item.status === "Verification Pending" ? "Verify Ownership" : "View Details & Claim",
          btnClass: item.status === "Verification Pending" ? "btn-gold" : "btn-dark",
        })));
        setApiMessage("");
      })
      .catch(() => {
        if (active) setApiMessage("Showing sample items. Start the Flask API to load saved reports.");
      });
    return () => { active = false; };
  }, []);

  const searchableItems = directoryItems.filter((item) => {
    if (item.status === "Verification Pending" || item.status === "Claim In Progress") return false;

    const normalizedSearch = search.trim().toLocaleLowerCase();
    const searchableText = `${item.id} ${item.category} ${item.title} ${item.desc} ${item.location} ${item.status}`.toLocaleLowerCase();
    if (normalizedSearch && !searchableText.includes(normalizedSearch)) return false;

    const normalizedCategory = item.category === "IDs & Wallets" ? "IDs & Cards" : item.category;
    if (category !== "All Categories" && normalizedCategory !== category) return false;

    if (location !== "Everywhere") {
      const locationTerms = {
        "North Campus Hub": ["North Campus", "Transit Pavilion"],
        "Main Library Wing": ["Main Library"],
        "Science Complex": ["Science Complex"],
        "Engineering Hall": ["Engineering"],
        "Dining Commons": ["Dining Commons"],
        "Sports Center": ["Sports Center"],
      }[location] || [location];
      if (!locationTerms.some((term) => item.location.toLocaleLowerCase().includes(term.toLocaleLowerCase()))) return false;
    }

    if (dateWindow !== "All Time") {
      const itemDate = new Date(item.date);
      const days = dateWindow === "Past 24 Hours" ? 1 : dateWindow === "Past 7 Days" ? 7 : 30;
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      if (Number.isNaN(itemDate.getTime()) || itemDate < cutoff) return false;
    }

    return true;
  });

  const resetFilters = () => {
    setSearch("");
    setCategory("All Categories");
    setLocation("Everywhere");
    setDateWindow("All Time");
  };

  return (
    <>
      {/* ── HEADER ── */}
      <header className="sp-header">
        <div className="sp-header-inner">
          {/* Brand */}
          <div className="sp-brand">
            <div className="sp-brand-icon">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: 22 }}>school</span>
            </div>
            <div className="sp-brand-text">
              <div className="sp-brand-title">
                <span className="sp-brand-name">FindHub Portal</span>
                <span className="sp-badge-academic">Academic</span>
              </div>
              <span className="sp-brand-sub">Campus Infrastructure</span>
            </div>
          </div>

          {/* Nav */}
          <nav className="sp-nav app-nav-links" aria-label="Primary navigation">
            <button type="button" className="app-nav-link" onClick={() => navigate("/home")}><span className="material-symbols-outlined">home</span> Home</button>
            <button type="button" className="app-nav-link" onClick={() => navigate("/report-item")}><span className="material-symbols-outlined">edit_document</span> Report</button>
            <button type="button" className="app-nav-link app-nav-link--active" onClick={() => navigate("/search")}><span className="material-symbols-outlined">search</span> Matches</button>
          </nav>

          {/* Right icons */}
          <div className="sp-header-right">
            <button className="sp-icon-btn" title="Notifications" onClick={() => navigate("/notifications")}>
              <span className="material-symbols-outlined">notifications</span>
              <span className="sp-notif-dot" />
            </button>
            <button className="sp-icon-btn" title="Support" onClick={() => navigate("/support")}>
              <span className="material-symbols-outlined">help</span>
            </button>
            <button type="button" className="sp-avatar" aria-label="Open profile" onClick={() => navigate("/profile")}>JS</button>
          </div>
        </div>

        {/* Gold ribbon */}
        <div className="sp-ribbon">
          <div className="sp-ribbon-inner">
            <span className="sp-ribbon-left">
              <span className="sp-ribbon-dot" />
              FindHub Registry
            </span>
            <span className="sp-ribbon-right">
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>shield</span>
              Institutional Security &amp; Custody Division
            </span>
          </div>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="sp-main">

        {/* Breadcrumb */}
        <nav className="sp-breadcrumb">
          <a href="/home">Home</a>
          <span>/</span>
          <a href="/search">Directory Search</a>
          <span>/</span>
          <span className="sp-breadcrumb-current">Reported Items</span>
        </nav>

        {/* Page heading */}
        <div className="sp-page-heading">
          <div>
            <h1>Search Reported Items</h1>
            <p>Browse real-time registry of 603 verified lost &amp; found articles across campus hubs.</p>
          </div>
          <span className="sp-custody-badge">
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>verified_user</span>
            Chain-of-Custody Protected
          </span>
        </div>

        {/* Filter bar */}
        <section className="sp-filter-bar">
          {/* Search input */}
          <div className="sp-search-wrap">
            <span className="sp-search-icon material-symbols-outlined">search</span>
            <input
              className="sp-search-input"
              type="text"
              placeholder="Type exact item name, brand, model, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search reported items"
            />
            <kbd className="sp-kbd">⌘K</kbd>
          </div>

          {/* Filters */}
          <div className="sp-filters-grid">
            <div className="sp-filter-group">
              <label>Category</label>
              <div className="sp-select-wrap">
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option>All Categories</option>
                  <option>Electronics</option>
                  <option>Books &amp; Stationery</option>
                  <option>IDs &amp; Cards</option>
                  <option>Keys &amp; Wallets</option>
                  <option>Bags &amp; Apparel</option>
                  <option>Accessories</option>
                </select>
                <span className="material-symbols-outlined sp-select-arrow">expand_more</span>
              </div>
            </div>
            <div className="sp-filter-group">
              <label>Campus Hub / Location</label>
              <div className="sp-select-wrap">
                <select value={location} onChange={(e) => setLocation(e.target.value)}>
                  <option>Everywhere</option>
                  <option>North Campus Hub</option>
                  <option>Main Library Wing</option>
                  <option>Science Complex</option>
                  <option>Engineering Hall</option>
                  <option>Dining Commons</option>
                  <option>Sports Center</option>
                </select>
                <span className="material-symbols-outlined sp-select-arrow">expand_more</span>
              </div>
            </div>
            <div className="sp-filter-group">
              <label>Date Window</label>
              <div className="sp-select-wrap">
                <select value={dateWindow} onChange={(e) => setDateWindow(e.target.value)}>
                  <option>Past 24 Hours</option>
                  <option>Past 7 Days</option>
                  <option>Past 30 Days</option>
                  <option>All Time</option>
                </select>
                <span className="material-symbols-outlined sp-select-arrow">expand_more</span>
              </div>
            </div>
          </div>

          {/* Sort bar */}
          <div className="sp-sort-bar">
            <span className="sp-item-count">{searchableItems.length} Items Found</span>
            <div className="sp-sort-actions">
              <button type="button" className="sp-reset-btn" onClick={resetFilters}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>refresh</span>
                Reset Filters
              </button>
              <div className="sp-divider-v" />
              <button className="sp-export-btn">
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>file_download</span>
                Export CSV
              </button>
            </div>
          </div>
        </section>

        {/* Items grid */}
        <div className="sp-items-grid">
          {apiMessage && <p className="sp-api-message" role="status">{apiMessage}</p>}
          {searchableItems.length ? searchableItems.map((item) => (
            <div className="sp-item-card" key={item.id}>
              <div className="sp-item-top">
                {/* Category + ID */}
                <div className="sp-item-meta">
                  <span className={`sp-cat-badge ${item.categoryColor}`}>{item.category}</span>
                  <span className="sp-item-id">#{item.id}</span>
                </div>
                {/* Title */}
                <h2 className="sp-item-title">{item.title}</h2>
                {/* Desc */}
                <p className="sp-item-desc">{item.desc}</p>
                {/* Location + date */}
                <div className="sp-item-details">
                  <div className="sp-item-detail-row">
                    <span className="material-symbols-outlined sp-icon-gold" style={{ fontSize: 16 }}>location_on</span>
                    <span className="sp-truncate">{item.location}</span>
                  </div>
                  <div className="sp-item-detail-row">
                    <span className="material-symbols-outlined sp-icon-muted" style={{ fontSize: 15 }}>calendar_today</span>
                    <span>{item.date}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="sp-item-footer">
                <div className="sp-custody-row">
                  <span className="sp-custody-label">Custody State</span>
                  <span className={`sp-custody-status ${item.statusColor}`}>• {item.status}</span>
                </div>
                <button
                  className={`sp-action-btn ${item.btnClass}`}
                  onClick={() => navigate(item.status === "Verification Pending" ? "/claim-details" : "/claim", { state: { id: item.id, item } })}
                >
                  <span className="sp-action-default">{item.btnLabel}</span>
                  <span className="sp-action-hover">Verify Ownership</span>
                </button>
              </div>
            </div>
          )) : (
            <div className="sp-empty-state">
              <span className="material-symbols-outlined" aria-hidden="true">search_off</span>
              <h2>No matching items</h2>
              <p>Try a different search term or loosen one of the filters.</p>
              <button type="button" className="sp-reset-btn" onClick={resetFilters}>Clear search and filters</button>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="sp-pagination">
          <span className="sp-page-info">
            Showing <strong>1 - {searchableItems.length}</strong> of <strong>{searchableItems.length}</strong> entries (Page 1 of 1)
          </span>
          <div className="sp-page-btns">
            <button className="sp-page-btn sp-page-prev" disabled>Previous</button>
            <button className="sp-page-btn sp-page-active">1</button>
            <button className="sp-page-btn">2</button>
            <button className="sp-page-btn">3</button>
            <span className="sp-page-ellipsis">...</span>
            <button className="sp-page-btn">76</button>
            <button className="sp-page-btn">Next</button>
          </div>
        </div>

      </main>

      {/* ── FOOTER ── */}
      <footer className="sp-footer">
        <div className="sp-footer-inner">
          <div className="sp-footer-left">
            <div className="sp-footer-brand">
              <span className="material-symbols-outlined sp-footer-icon" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
              <span className="sp-footer-name">FindHub Portal</span>
            </div>
            <span className="sp-footer-copy">© 2024 FindHub Campus Infrastructure. All rights reserved.</span>
          </div>
          <div className="sp-footer-links">
            {["Privacy Policy","Terms of Service","Campus Safety","Support Center","Contact Hub Admin"].map(l => (
              <a href="/" key={l}>{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
