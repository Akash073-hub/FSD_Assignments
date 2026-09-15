import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Reportitem.css";

export default function ReportPage() {
  const navigate = useNavigate();
  const [itemTitle, setItemTitle] = useState("Apple AirPods Pro (2nd Gen) with MagSafe Case");
  const [category, setCategory] = useState("Electronics & Audio Equipment");
  const [location, setLocation] = useState("Main Library Wing (Floor 3 - Study Pod 12)");
  const [color, setColor] = useState("white");
  const [date, setDate] = useState("2024-10-25");

  return (
    <>
      {/* ── HEADER ── */}
      <header className="rp-header">
        <div className="rp-header-inner">
          {/* Brand */}
          <div className="rp-brand">
            <div className="rp-brand-icon">
              <span className="material-symbols-outlined rp-fill" style={{ fontSize: 22, color: "#c59b4b" }}>school</span>
            </div>
            <div className="rp-brand-text">
              <div className="rp-brand-row">
                <span className="rp-brand-name">FindHub Portal</span>
                <span className="rp-badge-academic">Academic</span>
              </div>
              <span className="rp-brand-sub">Campus Infrastructure</span>
            </div>
          </div>

          {/* Nav */}
          <nav className="rp-nav">
            <a href="/home" className="rp-nav-link" onClick={e => { e.preventDefault(); navigate("/home"); }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>home</span>
              Home
              <span className="rp-nav-underline" />
            </a>
          </nav>

          {/* Right */}
          <div className="rp-header-right">
              <button className="rp-icon-btn" title="Notifications" onClick={() => navigate("/notifications")}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>notifications</span>
              <span className="rp-notif-dot" />
            </button>
            <button className="rp-icon-btn" title="Help">
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>help</span>
            </button>
            <div className="rp-avatar">JS</div>
          </div>
        </div>
      </header>

      {/* ── GOLD SUB BAR ── */}
      <div className="rp-subbar">
        <div className="rp-subbar-inner">
          <span className="rp-subbar-left">
            <span className="rp-subbar-dot" />
            FindHub Registry • Item Ingestion &amp; Verification
          </span>
          <span className="rp-subbar-right">
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>verified_user</span>
            Institutional Security &amp; Custody Division
          </span>
        </div>
      </div>

      {/* ── MAIN ── */}
      <main className="rp-main">

        {/* Breadcrumb */}
        <nav className="rp-breadcrumb">
          <a href="/home" onClick={e => { e.preventDefault(); navigate("/home"); }}>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>home</span>
            Home
          </a>
          <span>/</span>
          <span className="rp-breadcrumb-current">Report New Item</span>
        </nav>

        {/* Page heading */}
        <div className="rp-page-heading">
          <div>
            <h1>Report New Item</h1>
            <p>Take or upload clear photos of the found item, verify location and specifications, then register to the campus custody database.</p>
          </div>
          <div className="rp-heading-badges">
            <span className="rp-badge-outline">
              <span className="material-symbols-outlined" style={{ fontSize: 16, color: "#c59b4b" }}>photo_camera</span>
              Item Photo / Verification
            </span>
            <span className="rp-badge-outline">
              <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#888" }}>lock</span>
              Encrypted Registry
            </span>
          </div>
        </div>

        {/* Grid */}
        <div className="rp-grid">

          {/* LEFT: Camera + Gallery */}
          <section className="rp-left">

            {/* Camera Card */}
            <div className="rp-camera-card">
              {/* Camera header */}
              <div className="rp-camera-header">
                <div className="rp-camera-header-left">
                  <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#c59b4b" }}>photo_camera</span>
                  <span className="rp-camera-title">Item Photo Capture</span>
                  <span className="rp-camera-ready-badge">Camera Ready</span>
                </div>
                <button className="rp-switch-btn">
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>cameraswitch</span>
                  Switch Camera
                </button>
              </div>

              {/* Camera viewport */}
              <div className="rp-viewport">
                <div className="rp-viewport-overlay" />
                <div className="rp-viewport-content">
                  <div className="rp-item-icon-circle">
                    <span className="material-symbols-outlined" style={{ fontSize: 40, color: "#c59b4b" }}>headphones</span>
                  </div>
                  <h4 className="rp-viewport-title">Apple AirPods Pro (2nd Gen)</h4>
                  <p className="rp-viewport-desc">White charging case with MagSafe. Clear focus acquired.</p>
                  <div className="rp-frame-ready">
                    <span className="rp-frame-dot" />
                    Photo Frame Ready
                  </div>
                </div>
                <div className="rp-viewport-footer">
                  <span>Position item centrally within frame with adequate lighting</span>
                  <span className="rp-primary-angle">Primary Angle</span>
                </div>
              </div>

              {/* Camera controls */}
              <div className="rp-camera-controls">
                <label className="rp-upload-btn">
                  <span className="material-symbols-outlined" style={{ fontSize: 16, color: "#c59b4b" }}>upload_file</span>
                  Upload File
                  <input type="file" accept="image/*" style={{ display: "none" }} />
                </label>
                <button className="rp-take-photo-btn">
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>photo_camera</span>
                  Take Photo
                </button>
                <button className="rp-retake-btn">
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>refresh</span>
                  Retake
                </button>
              </div>
            </div>

            {/* Gallery Card */}
            <div className="rp-gallery-card">
              <div className="rp-gallery-header">
                <h3 className="rp-gallery-title">
                  <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#c59b4b" }}>collections</span>
                  Item Photo Gallery
                </h3>
                <span className="rp-gallery-count">2 of 4 photos added</span>
              </div>
              <div className="rp-gallery-grid">
                {/* Photo 1 */}
                <div className="rp-photo rp-photo--active">
                  <div className="rp-photo-bg">
                    <span className="material-symbols-outlined" style={{ fontSize: 36, color: "#555" }}>headphones</span>
                  </div>
                  <div className="rp-photo-label">
                    <span className="rp-photo-angle">Front Angle</span>
                    <span className="rp-photo-primary">Primary</span>
                  </div>
                </div>
                {/* Photo 2 */}
                <div className="rp-photo">
                  <div className="rp-photo-bg">
                    <span className="material-symbols-outlined" style={{ fontSize: 36, color: "#555" }}>flip_camera_android</span>
                  </div>
                  <div className="rp-photo-label">
                    <span className="rp-photo-angle">Back / Engraving</span>
                    <span className="rp-photo-attached">Attached</span>
                  </div>
                </div>
                {/* Add photo */}
                <div className="rp-photo-add">
                  <span className="material-symbols-outlined" style={{ fontSize: 24, color: "#aaa" }}>add_a_photo</span>
                  <span className="rp-photo-add-label">+ Add Another Angle</span>
                </div>
              </div>
            </div>

          </section>

          {/* RIGHT: Form */}
          <section className="rp-right">
            <form className="rp-form" onSubmit={e => e.preventDefault()}>

              {/* Form header */}
              <div className="rp-form-header">
                <div className="rp-form-header-top">
                  <h2 className="rp-form-title">
                    <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#c59b4b" }}>edit_document</span>
                    Item Specifications
                  </h2>
                  <span className="rp-reg-badge">REG-AUTO #8501</span>
                </div>
                <p className="rp-form-desc">Verify item description, color, and location details prior to custody registration.</p>
              </div>

              {/* Item Title */}
              <div className="rp-field">
                <div className="rp-field-label-row">
                  <label className="rp-label">Item Title</label>
                  <span className="rp-ai-detected">
                    <span className="material-symbols-outlined" style={{ fontSize: 12 }}>auto_awesome</span>
                    AI Detected
                  </span>
                </div>
                <div className="rp-input-wrap">
                  <span className="rp-input-icon material-symbols-outlined" style={{ fontSize: 18 }}>label</span>
                  <input
                    type="text"
                    className="rp-input"
                    value={itemTitle}
                    onChange={e => setItemTitle(e.target.value)}
                  />
                </div>
              </div>

              {/* Category */}
              <div className="rp-field">
                <label className="rp-label">Category <span className="rp-required">*</span></label>
                <div className="rp-select-wrap">
                  <span className="rp-input-icon material-symbols-outlined" style={{ fontSize: 18 }}>category</span>
                  <select className="rp-select" value={category} onChange={e => setCategory(e.target.value)}>
                    <option>Electronics &amp; Audio Equipment</option>
                    <option>IDs, Cards &amp; Wallets</option>
                    <option>Books, Notebooks &amp; Stationery</option>
                    <option>Keys, Access Cards &amp; Fobs</option>
                    <option>Bags, Backpacks &amp; Apparel</option>
                    <option>Accessories, Bottles &amp; Eyewear</option>
                  </select>
                  <span className="rp-select-arrow material-symbols-outlined" style={{ fontSize: 18 }}>expand_more</span>
                </div>
              </div>

              {/* Location */}
              <div className="rp-field">
                <label className="rp-label">Location <span className="rp-required">*</span></label>
                <div className="rp-select-wrap">
                  <span className="rp-input-icon material-symbols-outlined" style={{ fontSize: 18 }}>location_on</span>
                  <select className="rp-select" value={location} onChange={e => setLocation(e.target.value)}>
                    <option>Main Library Wing (Floor 3 - Study Pod 12)</option>
                    <option>Science &amp; Engineering Complex (Room 204)</option>
                    <option>Dining Commons West (Main Hall)</option>
                    <option>Student Union Lounge &amp; Café</option>
                    <option>North Campus Gate &amp; Transit Stop</option>
                    <option>Sports Center Gymnasium &amp; Locker Area</option>
                    <option>Administrative Central Custody Vault</option>
                  </select>
                  <span className="rp-select-arrow material-symbols-outlined" style={{ fontSize: 18 }}>expand_more</span>
                </div>
                <p className="rp-field-hint">
                  <span className="material-symbols-outlined" style={{ fontSize: 12 }}>my_location</span>
                  Pin-pointed via Campus Wi-Fi Beacon #LIB-FL3-N
                </p>
              </div>

              {/* Color */}
              <div className="rp-field">
                <label className="rp-label">Color <span className="rp-required">*</span></label>
                <div className="rp-select-wrap">
                  <span className="rp-input-icon material-symbols-outlined" style={{ fontSize: 18 }}>palette</span>
                  <select className="rp-select" value={color} onChange={e => setColor(e.target.value)}>
                    <option value="white">White / Off-White</option>
                    <option value="black">Black / Matte Black</option>
                    <option value="silver">Silver / Gray</option>
                    <option value="gold">Gold / Champagne</option>
                    <option value="blue">Blue / Navy</option>
                    <option value="red">Red / Burgundy</option>
                    <option value="green">Green / Olive</option>
                    <option value="brown">Brown / Tan</option>
                    <option value="multicolor">Multi-color / Patterned</option>
                  </select>
                  <span className="rp-select-arrow material-symbols-outlined" style={{ fontSize: 18 }}>expand_more</span>
                </div>
                <div className="rp-color-swatches">
                  {[
                    { bg: "#fff", border: "#ccc", ring: true },
                    { bg: "#111", border: "#111" },
                    { bg: "#ccc", border: "#bbb" },
                    { bg: "#c59b4b", border: "#b08030" },
                    { bg: "#2563eb", border: "#1d4ed8" },
                    { bg: "#dc2626", border: "#b91c1c" },
                    { bg: "#16a34a", border: "#15803d" },
                  ].map((s, i) => (
                    <span
                      key={i}
                      className={`rp-swatch${s.ring ? " rp-swatch--active" : ""}`}
                      style={{ background: s.bg, borderColor: s.border }}
                    />
                  ))}
                  <span className="rp-swatch-label">Primary shade</span>
                </div>
              </div>

              {/* Date */}
              <div className="rp-field">
                <label className="rp-label">Date <span className="rp-required">*</span></label>
                <div className="rp-input-wrap rp-input-wrap--half">
                  <span className="rp-input-icon material-symbols-outlined" style={{ fontSize: 18 }}>calendar_today</span>
                  <input
                    type="date"
                    className="rp-input rp-input--date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Custody Status */}
              <div className="rp-custody-box">
                <div className="rp-custody-top">
                  <span className="rp-custody-title">
                    <span className="material-symbols-outlined" style={{ fontSize: 16, color: "#c59b4b" }}>warehouse</span>
                    Custody Status
                  </span>
                  <span className="rp-in-storage">IN_STORAGE</span>
                </div>
                <p className="rp-custody-desc">
                  Item will be placed into Locker <strong>#LIB-302-A</strong> at Library Central Custody upon submission.
                </p>
              </div>

              {/* Submit */}
              <div className="rp-submit-area">
                <button type="submit" className="rp-submit-btn">
                  <span className="material-symbols-outlined" style={{ fontSize: 22, color: "#c59b4b" }}>database</span>
                  Report Item
                </button>
                <p className="rp-submit-note">
                  <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#c59b4b" }}>shield</span>
                  Logged with Chain-of-Custody SHA-256 verification hash
                </p>
              </div>

            </form>
          </section>

        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="rp-footer">
        <div className="rp-footer-inner">
          <div className="rp-footer-left">
            <span className="material-symbols-outlined rp-fill" style={{ fontSize: 20, color: "#c59b4b" }}>school</span>
            <span className="rp-footer-name">FindHub Portal</span>
            <span className="rp-footer-sep">|</span>
            <span className="rp-footer-copy">© 2024 FindHub Campus Infrastructure. All rights reserved.</span>
          </div>
          <div className="rp-footer-links">
            {["Privacy Policy","Terms of Service","Campus Safety","Support Center","Contact Hub Admin"].map(l => (
              <a href="/" key={l}>{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}