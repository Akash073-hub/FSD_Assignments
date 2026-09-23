import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Loginpage.css";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim() || !email.endsWith("@rvu.edu.in")) {
      setError("Enter a valid @rvu.edu.in email address.");
      setSubmitted(false);
      return;
    }

    setError("");
    setSubmitted(true);
  };

  return (
    <div className="lp-root">
      <header className="lp-header">
        <div className="lp-header-inner">
          <div className="lp-brand">
            <div className="lp-brand-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <div className="lp-brand-text">
              <div className="lp-brand-title">
                FindHub Portal
                <span className="lp-badge">Academic</span>
              </div>
              <div className="lp-brand-sub">RV University · Campus Infrastructure</div>
            </div>
          </div>
        </div>
      </header>

      <div className="lp-subbar" role="banner">
        <div className="lp-subbar-inner">
          <div className="lp-subbar-left">
            <span className="lp-subbar-dot" aria-hidden="true" />
            <span>FindHub Registry</span>
            <span className="lp-subbar-sep" aria-hidden="true">·</span>
            <span>Password Recovery</span>
          </div>
        </div>
      </div>

      <main className="lp-main">
        <div className="lp-card-wrap">
          <div className="lp-card" role="region" aria-label="Reset password">
            <div className="lp-card-accent" aria-hidden="true" />
            <div className="lp-card-body">
              <div className="lp-card-header">
                <div className="lp-verified-icon" aria-hidden="true">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <polyline points="9 12 11 14 15 10" />
                  </svg>
                </div>
                <h1 className="lp-title">Forgot Password</h1>
                <p className="lp-subtitle">
                  Enter your institutional email to receive the password reset instructions.
                </p>
              </div>

              <form className="lp-form" onSubmit={handleSubmit} noValidate>
                <div className="lp-field">
                  <label className="lp-label" htmlFor="reset-email">
                    Institutional Email ID
                  </label>
                  <div className="lp-input-wrap">
                    <svg className="lp-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <input
                      id="reset-email"
                      type="email"
                      className={`lp-input${error ? " lp-input--error" : ""}`}
                      placeholder="username@rvu.edu.in"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError("");
                      }}
                      autoComplete="email"
                    />
                  </div>
                  {error && <p className="lp-error" role="alert">{error}</p>}
                </div>

                {submitted && (
                  <div className="lp-policy-notice" role="status">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    <p>
                      A password reset link has been sent to <strong>{email}</strong>.
                    </p>
                  </div>
                )}

                <div className="lp-submit-wrap">
                  <button type="submit" className="lp-submit-btn">
                    Confirm
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>
                </div>

                <div className="lp-forgot-password-row">
                  <button
                    type="button"
                    className="lp-forgot-password-btn"
                    onClick={() => navigate("/")}
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
