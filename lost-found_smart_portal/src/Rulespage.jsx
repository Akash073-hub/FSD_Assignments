import React from "react";
import { Building2, ClipboardCheck, GraduationCap, Headset, Home, LockKeyhole, ShieldCheck, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Rulespage.css";

const rules = [
  {
    icon: ShieldCheck,
    title: "Hand found items to security",
    text: "If you find something, be sincere and submit the item to the nearest campus security guard as soon as possible.",
  },
  {
    icon: Building2,
    title: "Use the Admin Block when security is unavailable",
    text: "If no security guard is available, take the item to the Admin Block reception and request an official custody entry.",
  },
  {
    icon: LockKeyhole,
    title: "Protect private details",
    text: "Do not post passwords, ID numbers, wallet contents, or other sensitive information publicly. Share identifying details only with authorized staff.",
  },
  {
    icon: ClipboardCheck,
    title: "Give complete report details",
    text: "Include the exact place and date/time the item was found, a clear description of the product, and a sharp image when submitting a report.",
  },
];

export default function RulesPage() {
  const navigate = useNavigate();

  return (
    <div className="rules-root">
      <header className="rules-header">
        <div className="rules-header-inner">
          <div className="rules-brand">
            <GraduationCap className="rules-brand-icon" aria-hidden="true" />
            <span>
              <strong>FindHub Portal</strong>
              <small>Campus Infrastructure</small>
            </span>
          </div>
          <button type="button" className="rules-close" title="Back to previous page" onClick={() => navigate(-1)}>
            <X aria-hidden="true" />
          </button>
        </div>
      </header>

      <main className="rules-main">
        <nav className="rules-breadcrumb" aria-label="Breadcrumb">
          <button type="button" onClick={() => navigate("/home")}><Home aria-hidden="true" /> Home</button>
          <span>/</span>
          <span>Rules &amp; Safety</span>
        </nav>

        <div className="rules-heading">
          <span className="rules-eyebrow">
            <ShieldCheck aria-hidden="true" />
            Campus custody guidance
          </span>
          <h1>Lost &amp; Found Rules</h1>
          <p>Follow these steps to keep found property secure and help return it to the right owner.</p>
        </div>

        <section className="rules-grid" aria-label="Rules to follow">
          {rules.map((rule, index) => (
            <article className="rules-card" key={rule.title}>
              <div className="rules-card-number">0{index + 1}</div>
              <div className="rules-card-icon">
                <rule.icon aria-hidden="true" />
              </div>
              <h2>{rule.title}</h2>
              <p>{rule.text}</p>
            </article>
          ))}
        </section>

        <div className="rules-notice">
          <Headset aria-hidden="true" />
          <p>For urgent safety concerns or valuable property, contact Campus Security immediately.</p>
        </div>
      </main>
    </div>
  );
}
