import { useState } from 'react'
import './App.css'

/* eslint-disable react/jsx-no-comment-textnodes */

/* ── SVG ICONS ── */
const GithubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 19 19" fill="none"><path fill="currentColor" fillRule="evenodd" d="M9.356 1.85C5.05 1.85 1.57 5.356 1.57 9.694a7.84 7.84 0 0 0 5.324 7.44c.387.079.528-.168.528-.376 0-.182-.013-.805-.013-1.454-2.165.467-2.616-.935-2.616-.935-.349-.91-.864-1.143-.864-1.143-.71-.48.051-.48.051-.48.787.051 1.2.805 1.2.805.695 1.194 1.817.857 2.268.649.064-.507.27-.857.49-1.052-1.728-.182-3.545-.857-3.545-3.87 0-.857.31-1.558.8-2.104-.078-.195-.349-1 .077-2.078 0 0 .657-.208 2.14.805a7.5 7.5 0 0 1 1.946-.26c.657 0 1.328.092 1.946.26 1.483-1.013 2.14-.805 2.14-.805.426 1.078.155 1.883.078 2.078.502.546.799 1.247.799 2.104 0 3.013-1.818 3.675-3.558 3.87.284.247.528.714.528 1.454 0 1.052-.012 1.896-.012 2.156 0 .208.142.455.528.377a7.84 7.84 0 0 0 5.324-7.441c.013-4.338-3.48-7.844-7.773-7.844" clipRule="evenodd"/></svg>
)

const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
)

const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 19 19" fill="none"><path fill="currentColor" fillRule="evenodd" d="M1.893 1.98c.052.072 1.245 1.769 2.653 3.77l2.892 4.114c.183.261.333.48.333.486s-.068.089-.152.183l-.522.593-.765.867-3.597 4.087c-.375.426-.734.834-.798.905a1 1 0 0 0-.118.148c0 .01.236.017.664.017h.663l.729-.83c.4-.457.796-.906.879-.999a692 692 0 0 0 1.794-2.038c.034-.037.301-.34.594-.675l.551-.624.345-.392a7 7 0 0 1 .34-.374c.006 0 .93 1.306 2.052 2.903l2.084 2.965.045.063h2.275c1.87 0 2.273-.003 2.266-.021-.008-.02-1.098-1.572-3.894-5.547-2.013-2.862-2.28-3.246-2.273-3.266.008-.019.282-.332 2.085-2.38l2-2.274 1.567-1.782c.022-.028-.016-.03-.65-.03h-.674l-.3.342a871 871 0 0 1-1.782 2.025c-.067.075-.405.458-.75.852a100 100 0 0 1-.803.91c-.148.172-.299.344-.99 1.127-.304.343-.32.358-.345.327-.015-.019-.904-1.282-1.976-2.808L6.365 1.85H1.8zm1.782.91 8.078 11.294c.772 1.08 1.413 1.973 1.425 1.984.016.017.241.02 1.05.017l1.03-.004-2.694-3.766L7.796 5.75 5.722 2.852l-1.039-.004-1.039-.004z" clipRule="evenodd"/></svg>
)

const DiscordIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 19" fill="none"><path fill="currentColor" d="M16.224 3.768a14.5 14.5 0 0 0-3.67-1.153c-.158.286-.343.67-.47.976a13.5 13.5 0 0 0-4.067 0c-.128-.306-.317-.69-.476-.976A14.4 14.4 0 0 0 3.868 3.77C1.546 7.28.916 10.703 1.231 14.077a14.7 14.7 0 0 0 4.5 2.306q.545-.748.965-1.587a9.5 9.5 0 0 1-1.518-.74q.191-.14.372-.293c2.927 1.369 6.107 1.369 8.999 0q.183.152.372.294-.723.437-1.52.74.418.838.963 1.588a14.6 14.6 0 0 0 4.504-2.308c.37-3.911-.63-7.302-2.644-10.309m-9.13 8.234c-.878 0-1.599-.82-1.599-1.82 0-.998.705-1.82 1.6-1.82.894 0 1.614.82 1.599 1.82.001 1-.705 1.82-1.6 1.82m5.91 0c-.878 0-1.599-.82-1.599-1.82 0-.998.705-1.82 1.6-1.82.893 0 1.614.82 1.599 1.82 0 1-.706 1.82-1.6 1.82"/></svg>
)

const LeetcodeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path fill="currentColor" d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/></svg>
)

/* ========================================================================== */

const USER_INFO = {
  name: "Akash Bhat",
  roleTitle: "Full Stack Developer & CS Student",
  statusTag: "Open for Internships",
  tagline: "Building real-world projects with clean code, strong CS fundamentals, and a passion for full-stack systems.",
  aboutText: "I'm a Computer Science student with hands-on experience building full-stack web applications, system tools, and automation scripts. I enjoy building things that solve real problems — from a self-healing server monitor to an agricultural platform. Always learning, always shipping.",
  location: "India",
  email: "akashramachandrabhatbca24@rvu.edu.in",
  github: "https://github.com/Akash073-hub",
  resumeLink: "#"
}

const SKILLS_DATA = [
  { category: "Languages", icon: "⚡", skills: ["JavaScript (ES6+)", "C++", "Python", "Bash/Shell", "HTML5", "CSS3", "SQL"] },
  { category: "Core CS", icon: "🧠", skills: ["Data Structures & Algorithms", "OOP", "Operating Systems", "DBMS", "Computer Networks", "System Design"] },
  { category: "Web & Backend", icon: "🌐", skills: ["React.js", "Node.js", "Express.js", "REST APIs", "MongoDB", "Webpack"] },
  { category: "Tools & Platforms", icon: "🛠️", skills: ["Git & GitHub", "Linux", "VS Code", "Cron Jobs", "Postman", "Vercel", "Netlify"] }
]

const PROJECTS_DATA = [
  {
    id: 1,
    title: "Farmix",
    type: "Full-Stack Web App",
    csMetric: "Agriculture Platform",
    description: "An agricultural platform connecting farmers and buyers. Features product listings, user authentication, and a responsive UI built for rural users. Covers the full stack from database to deployment.",
    tags: ["React", "Node.js", "MongoDB", "Express", "REST API"],
    github: "https://github.com/Akash073-hub/Farmix",
    demo: "#"
  },
  {
    id: 2,
    title: "FSD Assignments",
    type: "Full Stack Development",
    csMetric: "Academic Portfolio",
    description: "A collection of Full Stack Development lab assignments covering React components, Express servers, REST API integration, MongoDB CRUD operations, and browser-based debugging techniques.",
    tags: ["React", "Vite", "Express", "MongoDB", "DevTools"],
    github: "https://github.com/Akash073-hub/FSD_assignments_006",
    demo: "#"
  },
  {
    id: 3,
    title: "Car Game",
    type: "Browser Game",
    csMetric: "Vanilla JS • Canvas API",
    description: "A browser-based car racing game built with pure JavaScript and the HTML5 Canvas API. Features obstacle avoidance, score tracking, increasing difficulty, and smooth keyboard controls.",
    tags: ["JavaScript", "HTML5 Canvas", "CSS3", "Game Dev"],
    github: "https://github.com/Akash073-hub/CarRacinggame",
    demo: "#"
  },
  {
    id: 4,
    title: "Open Source Contributions",
    type: "Collaboration",
    csMetric: "Community Projects",
    description: "Active contributor to peer and open-source projects — including bug fixes, feature additions, code reviews, and documentation improvements across various repositories on GitHub.",
    tags: ["Git", "GitHub", "Code Review", "Open Source", "Collaboration"],
    github: "https://github.com/Akash073-hub",
    demo: "#"
  }
]

const COURSEWORK_DATA = [
  { code: "CS 201", name: "Data Structures & Algorithms", topics: "Arrays, Trees, Graphs, Sorting, Dynamic Programming, Complexity Analysis" },
  { code: "CS 301", name: "Operating Systems", topics: "Process Synchronization, Memory Management, File Systems, Shell Programming" },
  { code: "CS 304", name: "Database Management Systems", topics: "SQL, Normalization, ER Diagrams, ACID Transactions, MongoDB" },
  { code: "CS 402", name: "Full Stack Development", topics: "React, Node.js, Express, REST APIs, Browser DevTools, Deployment" }
]

const STATS_DATA = [
  { label: "GitHub Projects", value: "5+" },
  { label: "GitHub Commits", value: "100+" },
  { label: "CS Subjects", value: "10+" },
  { label: "Assignments Done", value: "20+" }
]

const TERMINAL_SNIPPETS = {
  "whoami.sh": `#!/bin/bash
echo "Name:     Akash Bhat"
echo "Role:     Full Stack Developer & CS Student"
echo "Location: India"
echo "Focus:    Web Apps, Systems, Open Source"
echo "Stack:    React • Node.js • Linux • C++"
echo "Status:   Open for Internships ✔"
echo "GitHub:   github.com/Akash073-hub"`,

  "projects.sh": `#!/bin/bash
echo "=== My Projects ==="
echo ""
echo "1. Farmix"
echo "   → Agriculture full-stack platform"
echo "   → github.com/Akash073-hub/Farmix"
echo ""
echo "2. Car Game"
echo "   → Browser game with Canvas API"
echo ""
echo "3. FSD_assignments_006"
echo "   → Full Stack Dev assignment collection"`,

  "skills.json": `{
  "developer": "Akash Bhat",
  "languages": ["JavaScript", "C++", "Python", "Bash"],
  "frontend": ["React.js", "HTML5", "CSS3"],
  "backend": ["Node.js", "Express.js", "REST APIs"],
  "database": ["MongoDB", "SQL"],
  "tools": ["Git", "Linux", "VS Code", "Cron"],
  "openToWork": true
}`
}

const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/Akash073-hub", Icon: GithubIcon, color: "#f1f5f9" },
  { label: "LinkedIn", href: "https://linkedin.com/in/", Icon: LinkedInIcon, color: "#0a66c2" },
  { label: "LeetCode", href: "https://leetcode.com/", Icon: LeetcodeIcon, color: "#ffa116" },
  { label: "X / Twitter", href: "https://x.com/", Icon: XIcon, color: "#f1f5f9" },
  { label: "Discord", href: "https://discord.com/", Icon: DiscordIcon, color: "#5865f2" },
]

function App() {
  const [activeTab, setActiveTab] = useState("whoami.sh")
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(USER_INFO.email)
    setCopiedEmail(true)
    setTimeout(() => setCopiedEmail(false), 2500)
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    setFormSubmitted(true)
    setTimeout(() => setFormSubmitted(false), 4000)
  }

  return (
    <div className="portfolio-app">

      
      <nav className="navbar">
        <div className="container nav-container">
          <a href="#hero" className="brand-logo">
            <span>&lt;akash.bhat /&gt;</span>
            <span className="brand-tag">CS Student</span>
          </a>
          <ul className="nav-links">
            <li><a href="#about">About</a></li>
            <li><a href="#skills">Skills</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#coursework">Coursework</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <div className="status-badge">
            <span className="pulse-dot"></span>
            <span>{USER_INFO.statusTag}</span>
          </div>
        </div>
      </nav>

      <main>
        
        <section id="hero" className="hero-section">
          <div className="container hero-grid">
            <div>
              <div className="hero-badge">💻 Full Stack Developer & CS Student</div>
              <h1 className="hero-title">
                Hi, I'm<br />
                <span className="gradient-text">{USER_INFO.name}</span>
              </h1>
              <p className="hero-subtitle">{USER_INFO.tagline}</p>

              <div className="hero-actions">
                <a href="#projects" className="btn-primary"><span>View Projects</span><span>↓</span></a>
                <a href={USER_INFO.github} target="_blank" rel="noreferrer" className="btn-secondary"><span>🐙 GitHub</span></a>
                <button onClick={handleCopyEmail} className="btn-secondary">
                  <span>{copiedEmail ? "✓ Copied!" : "📋 Copy Email"}</span>
                </button>
              </div>

              {/* SOCIAL ICON ROW */}
              <div className="hero-social-icons">
                {SOCIAL_LINKS.map(({ label, href, Icon, color }) => (
                  <a key={label} href={href} target="_blank" rel="noreferrer" className="social-icon-btn" title={label} style={{ '--icon-color': color }}>
                    <Icon />
                  </a>
                ))}
              </div>

              <div className="hero-cs-chips">
                <span className="cs-chip">React</span>
                <span className="cs-chip">Node.js</span>
                <span className="cs-chip">Linux</span>
                <span className="cs-chip">Bash</span>
                <span className="cs-chip">MongoDB</span>
                <span className="cs-chip">Full Stack</span>
              </div>
            </div>

            {/* TERMINAL */}
            <div className="terminal-window float-anim">
              <div className="terminal-header">
                <div className="terminal-dots">
                  <span className="dot dot-red"></span>
                  <span className="dot dot-yellow"></span>
                  <span className="dot dot-green"></span>
                </div>
                <span className="terminal-title">~/akash-bhat/terminal</span>
                <span className="code-comment">bash 5.2</span>
              </div>
              <div className="terminal-tabs">
                {Object.keys(TERMINAL_SNIPPETS).map(tab => (
                  <button key={tab} className={`terminal-tab ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>{tab}</button>
                ))}
              </div>
              <div className="terminal-body">
                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{TERMINAL_SNIPPETS[activeTab]}</pre>
                <div style={{ marginTop: '12px', color: 'var(--accent-cyan)' }}>
                  <span>akash@dev:~$ </span><span className="cursor-blink">█</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        
        <section id="about" className="section-padding">
          <div className="container">
            <div className="glass-card" style={{ padding: '40px' }}>
              <div className="section-tag">// ABOUT ME</div>
              <h2 className="section-title">Code. Build. Ship. Repeat.</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.8', maxWidth: '900px' }}>{USER_INFO.aboutText}</p>
            </div>
          </div>
        </section>

        
        <section id="skills" className="section-padding">
          <div className="container">
            <div className="section-header">
              <span className="section-tag">// TECHNICAL SKILLS</span>
              <h2 className="section-title">Tech Stack & CS Knowledge</h2>
              <p className="section-subtitle">Core CS concepts and tools I work with.</p>
            </div>
            <div className="skills-grid">
              {SKILLS_DATA.map((cat, idx) => (
                <div key={idx} className="glass-card skill-category-card">
                  <div className="category-header">
                    <span className="category-icon">{cat.icon}</span>
                    <h3 className="category-title">{cat.category}</h3>
                  </div>
                  <div className="skill-tags">
                    {cat.skills.map((skill, sIdx) => (
                      <span key={sIdx} className="skill-badge">{skill}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        
        <section id="projects" className="section-padding">
          <div className="container">
            <div className="section-header">
              <span className="section-tag">// MY PROJECTS</span>
              <h2 className="section-title">Things I've Built</h2>
              <p className="section-subtitle">Real projects from my GitHub — not just tutorials.</p>
            </div>
            <div className="projects-grid">
              {PROJECTS_DATA.map(proj => (
                <div key={proj.id} className="glass-card project-card">
                  <div className="project-top">
                    <div className="project-meta">
                      <span className="project-type">{proj.type}</span>
                      <span className="project-cs-metric">{proj.csMetric}</span>
                    </div>
                    <h3 className="project-title">{proj.title}</h3>
                    <p className="project-desc">{proj.description}</p>
                  </div>
                  <div>
                    <div className="project-tech-stack">
                      {proj.tags.map((t, i) => <span key={i} className="tech-chip">{t}</span>)}
                    </div>
                    <div className="project-links">
                      <a href={proj.github} className="project-link" target="_blank" rel="noreferrer">🐙 GitHub Code</a>
                      {proj.demo !== "#" && <a href={proj.demo} className="project-link" target="_blank" rel="noreferrer">🚀 Live Demo</a>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        
        <section id="coursework" className="section-padding">
          <div className="container">
            <div className="section-header">
              <span className="section-tag">// ACADEMICS</span>
              <h2 className="section-title">Core CS Coursework</h2>
              <p className="section-subtitle">Foundational subjects from my CS degree.</p>
            </div>
            <div className="coursework-grid">
              {COURSEWORK_DATA.map((course, idx) => (
                <div key={idx} className="glass-card course-card">
                  <div className="course-code">{course.code}</div>
                  <h3 className="course-name">{course.name}</h3>
                  <p className="course-details">Key Concepts: {course.topics}</p>
                </div>
              ))}
            </div>
            <div className="stats-banner">
              <div className="stats-grid">
                {STATS_DATA.map((stat, idx) => (
                  <div key={idx}>
                    <div className="stat-number">{stat.value}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        
        <section id="contact" className="section-padding">
          <div className="container">
            <div className="section-header">
              <span className="section-tag">// CONTACT</span>
              <h2 className="section-title">Let's Connect</h2>
              <p className="section-subtitle">Internship opportunities, collabs, or just say hi!</p>
            </div>

            <div className="contact-container">
              <div className="glass-card contact-info-card">
                <h3 style={{ fontSize: '1.4rem', marginBottom: '20px' }}>Contact Details</h3>
                <div className="contact-item">
                  <div className="contact-icon">📧</div>
                  <div>
                    <div className="contact-text-label">EMAIL</div>
                    <div className="contact-text-val">{USER_INFO.email}</div>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">📍</div>
                  <div>
                    <div className="contact-text-label">LOCATION</div>
                    <div className="contact-text-val">{USER_INFO.location}</div>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">🎓</div>
                  <div>
                    <div className="contact-text-label">STATUS</div>
                    <div className="contact-text-val">{USER_INFO.roleTitle}</div>
                  </div>
                </div>

                {/* SVG SOCIAL ICONS */}
                <div style={{ marginTop: '32px' }}>
                  <div className="contact-text-label" style={{ marginBottom: '14px' }}>FIND ME ONLINE</div>
                  <div className="social-icon-grid">
                    {SOCIAL_LINKS.map(({ label, href, Icon, color }) => (
                      <a key={label} href={href} target="_blank" rel="noreferrer" className="social-icon-card" title={label} style={{ '--icon-color': color }}>
                        <Icon />
                        <span>{label}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div className="glass-card contact-form">
                <h3 style={{ fontSize: '1.4rem', marginBottom: '20px' }}>Send a Message</h3>
                {formSubmitted ? (
                  <div style={{ padding: '20px', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: '8px', color: 'var(--accent-emerald)' }}>
                    ✓ Message received! I'll get back to you soon.
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit}>
                    <div className="form-group">
                      <label className="form-label">YOUR NAME</label>
                      <input type="text" className="form-input" placeholder="e.g. Priya Sharma" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">YOUR EMAIL</label>
                      <input type="email" className="form-input" placeholder="e.g. priya@example.com" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">MESSAGE</label>
                      <textarea className="form-textarea" placeholder="Hi Akash, I'd like to..." required></textarea>
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                      <span>Send Message</span><span>✈️</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-content">
          <div>© {new Date().getFullYear()} Akash Bhat • Built with React</div>
          <div className="footer-socials">
            {SOCIAL_LINKS.map(({ label, href, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" className="footer-icon" title={label}><Icon /></a>
            ))}
          </div>
          <a href="#hero" className="back-to-top">Back to Top ↑</a>
        </div>
      </footer>
    </div>
  )
}

export default App