# FSD Assignments

A collection of Full Stack Development assignments and practice projects built with React, Node.js, Express, EJS, and browser APIs.

## Concepts by Project

### 1. FindHub Smart Lost & Found Portal

**Folder:** [`lost-found_smart_portal`](lost-found_smart_portal)

**Concepts learned:**

- React component-based UI design
- React Router navigation and route-based page rendering
- Controlled forms, validation, and submission states
- Search, filtering, and navigation state
- Reusable header/navigation patterns
- Responsive CSS layouts and shared design tokens
- Material Symbols and Lucide icons
- Ownership verification and custody workflow UI
- Accessibility labels and semantic form structure

**Next concepts to learn:**

- API integration with a real backend
- Database persistence for users, items, claims, and notifications
- Authentication and protected routes
- Automated component and end-to-end testing
- File upload storage and image validation

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

**Concepts learned:**

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

**Next concepts to learn:**

- REST API design and JSON responses
- Middleware for authentication and validation
- Persistent storage with MongoDB or PostgreSQL
- Sessions, cookies, and CSRF protection
- Deployment and environment configuration

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

**Concepts learned:**

- React functional components
- `useState` for tabs, copy-to-clipboard feedback, and form status
- Data-driven rendering with arrays and `.map()`
- Reusable SVG icon components
- Portfolio and responsive interface design
- Contact form event handling
- Clipboard API usage
- Project, skills, coursework, and social-link data modeling
- CSS-based visual layout and animation

**Next concepts to learn:**

- Component extraction and reusable design systems
- Form submission to a backend service
- Accessibility testing and keyboard navigation
- Performance optimization and lazy loading
- Deployment with environment variables

**Run it:**

```bash
cd my-app
npm install
npm start
```

---

### 4. Student Registration Form

**Folder:** [`my-app2`](my-app2)

**Concepts learned:**

- Controlled React inputs
- Text, email, telephone, select, radio, and checkbox controls
- Form submission with `preventDefault`
- Conditional validation and error messages
- Resetting form state
- Toast-style success feedback
- Basic event handling and state management

**Next concepts to learn:**

- Schema-based form validation
- Reusable form field components
- Server-side validation
- Persisting submitted records in a database
- Error handling for asynchronous requests

**Run it:**

```bash
cd my-app2
npm install
npm start
```

---

### 5. Store Cart Application

**Folder:** [`myapp3`](myapp3)

**Concepts learned:**

- React Router routes and links
- React Context API
- Shared application state with `CartProvider`
- `useContext` and `useState`
- Add-to-cart and remove-from-cart operations
- Quantity updates and cart totals
- Derived state such as cart item counts
- Component composition and reusable product views

**Next concepts to learn:**

- Reducer-based state management with `useReducer`
- Persistent cart state with local storage
- Product data from an API
- Authentication and user-specific carts
- Checkout and payment workflow concepts

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

**Concepts learned:**

- JavaScript arrays
- Stack data structure
- `push()` insertion
- `pop()` removal
- LIFO behavior
- Node.js console execution

**Next concepts to learn:**

- Queue and deque data structures
- Stack implementation using a class
- Time and space complexity analysis
- Common stack algorithms such as balanced parentheses
- Choosing data structures for real application problems

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

## What Has Been Built

### FindHub Smart Lost & Found Portal

The main React application currently includes:

- Institutional login and forgot-password screens
- Dashboard navigation using React Router
- Searchable lost-and-found item directory UI
- Category, location, and date filter controls
- Found-item reporting form with photo-upload controls
- Ownership claim and verification screens
- Notifications, rules, custody-status, and responsive layouts
- Client-side form state, validation messages, loading state, and OTP-related state

The item records, login, OTP, claims, notifications, and password recovery are currently frontend demonstrations. They are stored in component state or static arrays, so a refresh does not provide real persistence. The next production step is to connect the React app to an API and database.

### Other Completed Practice

- `my-app` demonstrates a data-driven portfolio, tabs, clipboard interaction, and contact-form state.
- `my-app2` demonstrates controlled inputs, validation, checkboxes, radio buttons, reset behavior, and success feedback.
- `myapp3` demonstrates routing and shared cart state with React Context.
- `my-app4` demonstrates Node.js, Express, EJS templates, GET and POST routes, search, filtering, and 404 handling.
- `node1.js` demonstrates a stack using JavaScript arrays with `push()` and `pop()`.

## Learning Roadmap

Learn these topics in order. Each topic supports a feature already present in this workspace.

1. **HTML and CSS**: Learn semantic elements, forms, labels, responsive layouts, Flexbox, Grid, and accessibility. Example: a FindHub form uses a `<label>` connected to an `<input>` so the field is understandable to users and assistive technology.
2. **JavaScript fundamentals**: Learn variables, functions, objects, arrays, conditions, loops, destructuring, spread syntax, modules, and promises. Example: `items.filter((item) => item.category === selectedCategory)` creates a new list without changing the original list.
3. **DOM and browser APIs**: Learn events, form submission, `preventDefault`, timers, `localStorage`, clipboard access, and file inputs. Example: `navigator.clipboard.writeText(email)` copies an email address from the portfolio page.
4. **React components and JSX**: Learn how a UI is divided into components and how JavaScript values are rendered in JSX. Example: `SearchPage` renders every item with `searchableItems.map(...)`.
5. **React state and events**: Learn `useState`, controlled inputs, and immutable updates. Example: `setFormData({ ...formData, fullName: value })` updates one form field and causes the UI to render the new value.
6. **React effects**: Learn `useEffect`, dependency arrays, and cleanup functions. Example: an OTP countdown can use an interval inside `useEffect` and clear that interval when the component changes or unmounts.
7. **Routing and application state**: Learn React Router, URL routes, navigation, props, Context API, and `useReducer`. Example: `App.jsx` maps `/search` to `Searchpage`, while `CartContext` shares cart data across store pages.
8. **Forms and validation**: Learn client-side validation, error states, loading states, accessible labels, and server-side validation. Example: the login form checks the institutional email before allowing submission.
9. **Node.js and Express**: Learn servers, middleware, request and response objects, route parameters, query strings, status codes, and JSON. Example: `my-app4/server.js` reads `req.query.q` to filter search results.
10. **REST APIs and frontend integration**: Learn HTTP methods, `fetch`, JSON, headers, error handling, and asynchronous loading. Example: React should send a `POST /api/items` request when a user submits a found-item report.
11. **Databases**: Learn SQL tables and relationships, or MongoDB collections and documents, plus CRUD, indexes, and validation. Example: users, items, claims, and notifications should be stored instead of remaining in frontend arrays.
12. **Authentication and security**: Learn password hashing, sessions or secure tokens, protected routes, authorization, input sanitization, CORS, HTTPS, CSRF, and rate limiting. Example: only an authenticated campus user should submit a claim, and passwords must never be stored as plain text.
13. **File uploads**: Learn multipart forms, file-size and MIME validation, image storage, and safe file names. Example: uploaded item photos should be validated by the server and stored in object storage rather than only selected in the browser.
14. **Testing and debugging**: Learn unit tests, React Testing Library, API tests, browser DevTools, breakpoints, and logging. Example: test that submitting an invalid email shows an error and does not call the login callback.
15. **Git and deployment**: Learn commits, branches, pull requests, environment variables, production builds, hosting, and logs. Example: deploy the React frontend and Express API separately, then configure the API URL through an environment variable.
16. **Data structures and algorithms**: Learn stacks, queues, hash maps, sorting, searching, trees, graphs, recursion, complexity, and problem-solving. Example: the stack in `node1.js` is LIFO: the last value pushed is the first value removed.

## One Complete Example: Reporting an Item

The full-stack version of the FindHub report flow works like this:

1. The user enters an item title, category, location, date, and photo in React.
2. React stores the input values with `useState` and validates required fields.
3. React sends the form data to `POST /api/items` using `fetch`.
4. Express receives the request, validates it again, and authenticates the user.
5. The server stores the item and photo reference in the database.
6. The server returns JSON such as `{ "id": "FH-1050", "status": "Verification pending" }`.
7. React displays a success message and refreshes the item directory.
8. Later, a claim creates a related database record and notifications are sent to the appropriate users.

This example shows why frontend, backend, databases, authentication, file uploads, APIs, testing, and deployment are all separate skills that work together in a real application.
