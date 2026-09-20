# FSD Assignments

A collection of Full Stack Development assignments and practice projects built with React, Node.js, Express, EJS, and browser APIs.

## Projects

### 1. FindHub Smart Lost & Found Portal

**Folder:** [`lost-found_smart_portal`](lost-found_smart_portal)

A React campus lost-and-found portal for reporting found items, searching the item registry, verifying ownership, submitting claims, and viewing custody notifications.

**Topics demonstrated:**

- React component-based UI design
- React Router navigation and route-based page rendering
- Controlled forms, validation, and submission states
- Search, filtering, and navigation state
- Reusable header/navigation patterns
- Responsive CSS layouts and shared design tokens
- Material Symbols and Lucide icons
- Ownership verification and custody workflow UI
- Accessibility labels and semantic form structure

**Routes:**

| Route | Page |
| --- | --- |
| `/` | Institutional login |
| `/home` | FindHub dashboard |
| `/search` | Reported item directory and matching |
| `/claim` | Ownership claim and confirmation |
| `/report-item` | New found-item report |
| `/notifications` | Custody and match notifications |
| `/rules` | Lost-and-found safety rules |

**Run it:**

```bash
cd lost-found_smart_portal
npm install
npm start
```

Open `http://localhost:3000`.

**Build:**

```bash
npm run build
```

---

### 2. GameVault Express Application

**Folder:** [`my-app4`](my-app4)

A server-rendered game-library application built with Express and EJS. It includes a discover page, game search, profile page, item reporting flow, claim requests, and a custom not-found page.

**Topics demonstrated:**

- Node.js application setup
- Express server configuration
- EJS server-side templates and partials
- Static asset serving
- GET and POST routes
- Query-string search and category filtering
- Form submission handling with URL-encoded data
- Server-side rendering and view data binding
- Route-level 404 handling
- Reusable header and footer templates

**Run it:**

```bash
cd my-app4
npm install
npm start
```

The server uses port `3004` by default. Open `http://localhost:3004`.

**Development mode:**

```bash
npm run dev
```

---

### 3. Developer Portfolio

**Folder:** [`my-app`](my-app)

A React portfolio application presenting developer information, skills, projects, coursework, social links, a terminal-style interactive section, and a contact form.

**Topics demonstrated:**

- React functional components
- `useState` for tabs, copy-to-clipboard feedback, and form status
- Data-driven rendering with arrays and `.map()`
- Reusable SVG icon components
- Portfolio and responsive interface design
- Contact form event handling
- Clipboard API usage
- Project, skills, coursework, and social-link data modeling
- CSS-based visual layout and animation

**Run it:**

```bash
cd my-app
npm install
npm start
```

---

### 4. Student Registration Form

**Folder:** [`my-app2`](my-app2)

A React form assignment for collecting student registration information and demonstrating client-side validation, reset behavior, and toast feedback.

**Topics demonstrated:**

- Controlled React inputs
- Text, email, telephone, select, radio, and checkbox controls
- Form submission with `preventDefault`
- Conditional validation and error messages
- Resetting form state
- Toast-style success feedback
- Basic event handling and state management

**Run it:**

```bash
cd my-app2
npm install
npm start
```

---

### 5. Store Cart Application

**Folder:** [`myapp3`](myapp3)

A React shopping application with Home, Shop Items, and Cart routes. Products can be added, removed, and updated through a shared cart context.

**Topics demonstrated:**

- React Router routes and links
- React Context API
- Shared application state with `CartProvider`
- `useContext` and `useState`
- Add-to-cart and remove-from-cart operations
- Quantity updates and cart totals
- Derived state such as cart item counts
- Component composition and reusable product views

**Routes:**

| Route | Page |
| --- | --- |
| `/` | Store home |
| `/items` | Product listing |
| `/cart` | Shopping cart |

**Run it:**

```bash
cd myapp3
npm install
npm start
```

---

### 6. JavaScript Stack Exercise

**File:** [`node1.js`](node1.js)

A small Node.js console exercise demonstrating a last-in, first-out stack using a JavaScript array.

**Topics demonstrated:**

- JavaScript arrays
- Stack data structure
- `push()` insertion
- `pop()` removal
- LIFO behavior
- Node.js console execution

**Run it:**

```bash
node node1.js
```

---

## Topic Map

| Area | Covered in |
| --- | --- |
| React components and JSX | `my-app`, `my-app2`, `myapp3`, `lost-found_smart_portal` |
| React state and events | `my-app`, `my-app2`, `myapp3`, `lost-found_smart_portal` |
| React Router | `myapp3`, `lost-found_smart_portal` |
| Context API | `myapp3` |
| Forms and validation | `my-app2`, `my-app4`, `lost-found_smart_portal` |
| Express and Node.js | `my-app4`, `node1.js` |
| EJS server-side rendering | `my-app4` |
| REST-style route handling | `my-app4` |
| Search and filtering | `my-app4`, `lost-found_smart_portal` |
| Responsive CSS | `my-app`, `my-app4`, `lost-found_smart_portal` |
| Data-driven rendering | `my-app`, `myapp3`, `my-app4`, `lost-found_smart_portal` |
| Browser APIs | `my-app` clipboard interaction, `lost-found_smart_portal` file upload control |
| Data structures | `node1.js` stack exercise |

## Common React Commands

Run these commands inside a React project folder:

```bash
npm install
npm start
npm test
npm run build
```

`npm run build` creates a production build. `npm test` starts the Create React App test runner where tests are configured.

## Workspace Notes

- Each React folder is an independent Create React App project with its own `package.json` and dependencies.
- `my-app` and `my-app2` are separate React practice applications.
- `myapp3` is the React cart and routing exercise.
- `my-app4` is an independent Express/EJS server and does not use the React toolchain.
- `lost-found_smart_portal` is the main feature-rich React application in this workspace.
- Install dependencies from the individual project directory before starting a project.
