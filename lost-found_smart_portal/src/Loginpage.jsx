import React, { useState, useEffect } from "react";
import "./Loginpage.css";

export default function LoginPage({ onLoginSuccess, onForgotPassword }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    otp: "",
    agreed: false,
  });
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const formatCountdown = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required.";
    if (!formData.email.endsWith("@rvu.edu.in"))
      newErrors.email = "Must be a valid @rvu.edu.in email address.";
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\s/g, "")))
      newErrors.phone = "Enter a valid 10-digit phone number.";
    if (!formData.otp || formData.otp.length !== 6)
      newErrors.otp = "Enter the 6-digit OTP sent to your email.";
    if (!formData.agreed)
      newErrors.agreed = "You must agree to the campus policies to continue.";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSendOtp = () => {
    if (!formData.email.endsWith("@rvu.edu.in")) {
      setErrors((prev) => ({
        ...prev,
        email: "Must be a valid @rvu.edu.in email address.",
      }));
      return;
    }
    setOtpSent(true);
    setCountdown(45);
  };

  const handleResendOtp = () => {
    if (countdown === 0) {
      setCountdown(45);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsSubmitting(true);
    // Simulate auth — replace with real API call
    setTimeout(() => {
      setIsSubmitting(false);
      if (onLoginSuccess) onLoginSuccess(formData);
    }, 1500);
  };

  return (
    <div className="lp-root">
      {/* Header */}
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
          <div className="lp-header-actions">
            <div className="lp-secure-chip" aria-label="Official RVU Domain Verification">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Official RVU Domain Verification
            </div>
            <a href="#help" className="lp-support-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              Support
            </a>
          </div>
        </div>
      </header>

      {/* Sub-bar */}
      <div className="lp-subbar" role="banner">
        <div className="lp-subbar-inner">
          <div className="lp-subbar-left">
            <span className="lp-subbar-dot" aria-hidden="true" />
            <span>FindHub Registry</span>
            <span className="lp-subbar-sep" aria-hidden="true">·</span>
            <span>Secure Campus Authentication</span>
          </div>
          <div className="lp-subbar-right">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Institutional Security &amp; Custody Division
          </div>
        </div>
      </div>

      {/* Main */}
      <main className="lp-main">
        <div className="lp-card-wrap">
          <div className="lp-card" role="region" aria-label="Sign in to FindHub Portal">
            <div className="lp-card-accent" aria-hidden="true" />

            <div className="lp-card-body">
              {/* Card header */}
              <div className="lp-card-header">
                <div className="lp-verified-icon" aria-hidden="true">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <polyline points="9 12 11 14 15 10" />
                  </svg>
                </div>
                <h1 className="lp-title">RV University Single Sign-On</h1>
                <p className="lp-subtitle">
                  Sign in with your verified institutional credentials{" "}
                  <strong className="lp-email-highlight">(@rvu.edu.in)</strong> to access
                  campus custody and lost &amp; found records.
                </p>
              </div>

              {/* Auth policy notice */}
              <div className="lp-policy-notice" role="note">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <p>
                  <strong>Strict Authentication Policy:</strong> Only valid{" "}
                  <span className="lp-email-highlight">@rvu.edu.in</span> institutional
                  email addresses are permitted for custody logging.
                </p>
              </div>

              {/* Form */}
              <form className="lp-form" onSubmit={handleSubmit} noValidate>
                {/* Full Name */}
                <div className="lp-field">
                  <label className="lp-label" htmlFor="fullName">
                    Full Name (Institutional Records)
                  </label>
                  <div className="lp-input-wrap">
                    <svg className="lp-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      className={`lp-input${errors.fullName ? " lp-input--error" : ""}`}
                      placeholder="e.g., Jane Smith"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      autoComplete="name"
                    />
                  </div>
                  {errors.fullName && (
                    <p className="lp-error" role="alert">{errors.fullName}</p>
                  )}
                </div>

                {/* Institutional Email */}
                <div className="lp-field">
                  <div className="lp-label-row">
                    <label className="lp-label" htmlFor="email">
                      Institutional Email ID
                    </label>
                    <span className="lp-required-chip">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      Required @rvu.edu.in
                    </span>
                  </div>
                  <div className="lp-input-wrap lp-input-wrap--otp">
                    <svg className="lp-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className={`lp-input lp-input--with-action${errors.email ? " lp-input--error" : ""}`}
                      placeholder="username@rvu.edu.in"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      autoComplete="email"
                    />
                    <button
                      type="button"
                      className="lp-otp-btn"
                      onClick={handleSendOtp}
                      aria-label="Send OTP to institutional email"
                    >
                      {otpSent ? "Resend OTP" : "Send OTP"}
                    </button>
                  </div>
                  {errors.email && (
                    <p className="lp-error" role="alert">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="lp-field">
                  <label className="lp-label" htmlFor="phone">
                    Emergency Contact Phone
                  </label>
                  <div className="lp-input-wrap lp-input-wrap--phone">
                    <span className="lp-phone-prefix" aria-label="India country code">+91</span>
                    <div className="lp-phone-inner">
                      <svg className="lp-input-icon" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.71 3.49 2 2 0 0 1 3.68 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.13 6.13l1.02-1.02a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        className={`lp-input lp-input--phone-field${errors.phone ? " lp-input--error" : ""}`}
                        placeholder="98765 43210"
                        value={formData.phone}
                        onChange={handleChange}
                        autoComplete="tel"
                        maxLength={11}
                      />
                    </div>
                  </div>
                  {errors.phone && (
                    <p className="lp-error" role="alert">{errors.phone}</p>
                  )}
                </div>

                {/* OTP */}
                <div className="lp-field">
                  <div className="lp-label-row">
                    <label className="lp-label" htmlFor="otp">
                      Email Verification OTP
                    </label>
                    {otpSent && (
                      <button
                        type="button"
                        className={`lp-resend-btn${countdown > 0 ? " lp-resend-btn--disabled" : ""}`}
                        onClick={handleResendOtp}
                        disabled={countdown > 0}
                        aria-live="polite"
                      >
                        {countdown > 0
                          ? `Resend in ${formatCountdown(countdown)}`
                          : "Resend OTP"}
                      </button>
                    )}
                  </div>
                  <div className="lp-input-wrap">
                    <svg className="lp-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                    </svg>
                    <input
                      id="otp"
                      name="otp"
                      type="text"
                      inputMode="numeric"
                      className={`lp-input lp-input--mono${errors.otp ? " lp-input--error" : ""}`}
                      placeholder="Enter 6-digit OTP"
                      value={formData.otp}
                      onChange={handleChange}
                      maxLength={6}
                      autoComplete="one-time-code"
                    />
                    {otpSent && (
                      <span className="lp-otp-status" aria-live="polite">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                          <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                        Sent
                      </span>
                    )}
                  </div>
                  {errors.otp && (
                    <p className="lp-error" role="alert">{errors.otp}</p>
                  )}
                </div>

                {/* Forgot password */}
                <div className="lp-forgot-password-row">
                  <button
                    type="button"
                    className="lp-forgot-password-btn"
                    onClick={onForgotPassword}
                    aria-label="Forgot Password?"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Consent */}
                <div className="lp-field lp-consent">
                  <label className="lp-checkbox-label">
                    <input
                      name="agreed"
                      type="checkbox"
                      className="lp-checkbox"
                      checked={formData.agreed}
                      onChange={handleChange}
                      required
                    />
                    <span className="lp-checkbox-text">
                      I agree to RVU Academic Infrastructure policies and chain-of-custody
                      protocols for handling campus property.
                    </span>
                  </label>
                  {errors.agreed && (
                    <p className="lp-error" role="alert">{errors.agreed}</p>
                  )}
                </div>

                {/* Submit */}
                <div className="lp-submit-wrap">
                  <button
                    type="submit"
                    className="lp-submit-btn"
                    disabled={isSubmitting}
                    aria-busy={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="lp-spinner" aria-hidden="true" />
                        Signing in…
                      </>
                    ) : (
                      <>
                        Log In to FindHub Portal
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Footer links */}
              <div className="lp-card-footer">
                <a href="#helpdesk" className="lp-helpdesk-link">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  Need help accessing your RVU ID?
                </a>
                <a href="mailto:helpdesk@rvu.edu.in" className="lp-helpdesk-email">
                  helpdesk@rvu.edu.in
                </a>
              </div>
            </div>
          </div>

          {/* Trust line */}
          <div className="lp-trust-line" aria-label="Session security notice">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            End-to-End Encrypted Session · RV University Cyber Infrastructure
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-footer-brand">
            <div className="lp-footer-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="22" y1="12" x2="2" y2="12" />
                <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
              </svg>
              RV University
            </div>
            <p className="lp-footer-copy">
              © 2024 FindHub Portal · Academic Campus Infrastructure &amp; Custody Division. All rights reserved.
            </p>
          </div>
          <nav className="lp-footer-nav" aria-label="Footer navigation">
            <a href="#security">Institutional Security</a>
            <a href="#custody">Custody Protocols</a>
            <a href="#dispatch">Campus Police Dispatch</a>
            <a href="#privacy">Privacy Policy</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}