import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiRequest } from "./api";
import "./Reportitem.css";

export default function ReportPage() {
  const navigate = useNavigate();
  const routeLocation = useLocation();
  const [itemTitle, setItemTitle] = useState("");
  const [category, setCategory] = useState("Electronics & Audio Equipment");
  const [location, setLocation] = useState("Main Library Wing (Floor 3 - Study Pod 12)");
  const [color, setColor] = useState("white");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState([]);
  const [submitMessage, setSubmitMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addPhotos = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (photos.length + files.length > 4) { setSubmitMessage("You can attach up to 4 photos."); return; }
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    const selected = [];
    try {
      for (const file of files) {
        if (!validTypes.includes(file.type)) { setSubmitMessage("Photos must be JPEG, PNG, or WebP."); return; }
        if (file.size > 2 * 1024 * 1024) { setSubmitMessage("Each photo must be smaller than 2 MB."); return; }
        const dataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = () => reject(new Error("Could not read the selected photo.")); reader.readAsDataURL(file);
        });
        selected.push({ name: file.name, contentType: file.type, dataUrl });
      }
      setPhotos((current) => [...current, ...selected]);
      setSubmitMessage("");
    } catch (error) {
      setSubmitMessage(error.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitMessage("");
    setIsSubmitting(true);
    try {
      const result = await apiRequest("/items", {
        method: "POST",
        body: JSON.stringify({ title: itemTitle, category, location, color, date, description, images: photos }),
      });
      setSubmitMessage(`Item reported successfully. Registry ID: ${result.item.registryId}`);
    } catch (error) {
      setSubmitMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <nav className="rp-nav app-nav-links" aria-label="Primary navigation">
            <button type="button" className={`app-nav-link${routeLocation.pathname === "/home" ? " app-nav-link--active" : ""}`} onClick={() => navigate("/home")}><span className="material-symbols-outlined">home</span> Home</button>
            <button type="button" className="app-nav-link app-nav-link--active" onClick={() => navigate("/report-item")}><span className="material-symbols-outlined">edit_document</span> Report</button>
            <button type="button" className={`app-nav-link${routeLocation.pathname === "/search" ? " app-nav-link--active" : ""}`} onClick={() => navigate("/search")}><span className="material-symbols-outlined">search</span> Matches</button>
          </nav>

          {/* Right */}
          <div className="rp-header-right">
            <button className="rp-icon-btn" title="Notifications" onClick={() => navigate("/notifications")}>
              <span className="material-symbols-outlined">notifications</span>
              <span className="rp-notif-dot" />
            </button>
            <button className="rp-icon-btn" title="Support" onClick={() => navigate("/support")}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>help</span>
            </button>
            <button type="button" className="rp-avatar" aria-label="Open profile" onClick={() => navigate("/profile")}>JS</button>
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
                  <span className="rp-camera-ready-badge">Photo upload enabled</span>
                </div>
              </div>

              {/* Camera viewport */}
              <div className="rp-viewport">
                <div className="rp-viewport-overlay" />
                <div className="rp-viewport-content">
                  {photos[0] ? <img className="rp-viewport-photo" src={photos[0].dataUrl} alt="Selected item" /> : <div className="rp-item-icon-circle"><span className="material-symbols-outlined" style={{ fontSize: 40, color: "#c59b4b" }}>add_a_photo</span></div>}
                  <h4 className="rp-viewport-title">{itemTitle || "Your item photo"}</h4>
                  <p className="rp-viewport-desc">{photos[0]?.name || "Upload a clear photo to preview it here."}</p>
                  <div className="rp-frame-ready">
                    <span className="rp-frame-dot" />
                    {photos.length ? `${photos.length} photo${photos.length === 1 ? "" : "s"} selected` : "No photo selected"}
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
                  <input id="rp-photo-upload" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={addPhotos} style={{ display: "none" }} />
                </label>
                <label htmlFor="rp-photo-upload" className="rp-take-photo-btn">
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>photo_camera</span>
                  Choose Photos
                </label>
                <button type="button" className="rp-retake-btn" onClick={() => setPhotos([])} disabled={!photos.length}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>refresh</span>
                  Clear Photos
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
                <span className="rp-gallery-count">{photos.length} of 4 photos added</span>
              </div>
              <div className="rp-gallery-grid">
                {photos.map((photo, index) => <div className="rp-photo rp-photo--active" key={`${photo.name}-${index}`}><img className="rp-photo-preview" src={photo.dataUrl} alt={`Selected item ${index + 1}`} /><div className="rp-photo-label"><span className="rp-photo-angle">{photo.name}</span><button type="button" className="rp-photo-remove" onClick={() => setPhotos((current) => current.filter((_, photoIndex) => photoIndex !== index))} aria-label={`Remove ${photo.name}`}>×</button></div></div>)}
                {photos.length < 4 && <button type="button" className="rp-photo-add" onClick={() => document.getElementById("rp-photo-upload")?.click()}>
                  <span className="material-symbols-outlined" style={{ fontSize: 24, color: "#aaa" }}>add_a_photo</span>
                  <span className="rp-photo-add-label">+ Add Another Angle</span>
                </button>}
              </div>
            </div>

          </section>

          {/* RIGHT: Form */}
          <section className="rp-right">
            <form className="rp-form" onSubmit={handleSubmit}>

              {/* Form header */}
              <div className="rp-form-header">
                <div className="rp-form-header-top">
                  <h2 className="rp-form-title">
                    <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#c59b4b" }}>edit_document</span>
                    Item Specifications
                  </h2>
              <span className="rp-reg-badge">Registry ID assigned on save</span>
                </div>
                <p className="rp-form-desc">Verify item description, color, and location details prior to custody registration.</p>
              </div>

              {/* Item Title */}
              <div className="rp-field">
                <div className="rp-field-label-row">
                  <label className="rp-label">Item Title</label>
                  <span className="rp-ai-detected">Required</span>
                </div>
                <div className="rp-input-wrap">
                  <span className="rp-input-icon material-symbols-outlined" style={{ fontSize: 18 }}>label</span>
                  <input
                    type="text"
                    className="rp-input"
                    value={itemTitle}
                    maxLength={120}
                    required
                    placeholder="Describe the found item"
                    onChange={e => setItemTitle(e.target.value)}
                  />
                </div>
              </div>

              <div className="rp-field">
                <label className="rp-label" htmlFor="rp-description">Description <span className="rp-required">*</span></label>
                <textarea id="rp-description" className="rp-textarea" required minLength={10} maxLength={1500} rows={4} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Include identifying details, marks, or contents. Do not list sensitive information." />
                <small>{description.length}/1500 characters</small>
              </div>

              {/* Category */}
              <div className="rp-field">
                <label className="rp-label">Category <span className="rp-required">*</span></label>
                <div className="rp-select-wrap">
                  <span className="rp-input-icon material-symbols-outlined" style={{ fontSize: 18 }}>category</span>
                  <select className="rp-select" value={category} required onChange={e => setCategory(e.target.value)}>
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
                  <select className="rp-select" value={location} required onChange={e => setLocation(e.target.value)}>
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
                  <select className="rp-select" value={color} required onChange={e => setColor(e.target.value)}>
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
                    required
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
                <p className="rp-custody-desc">The item is added to the registry as <strong>In Storage</strong>. Staff can record verified custody locations from the custody log.</p>
              </div>

              {/* Submit */}
              <div className="rp-submit-area">
                <button type="submit" className="rp-submit-btn" disabled={isSubmitting}>
                  <span className="material-symbols-outlined" style={{ fontSize: 22, color: "#c59b4b" }}>database</span>
                  {isSubmitting ? "Submitting…" : "Report Item"}
                </button>
                {submitMessage && <p role="status" aria-live="polite">{submitMessage}</p>}
                <p className="rp-submit-note">
                  <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#c59b4b" }}>shield</span>
                  Saved to the signed-in campus account with a registry timestamp
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
