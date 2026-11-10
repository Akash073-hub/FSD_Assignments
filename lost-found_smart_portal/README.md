# FindHub Smart Lost & Found Portal

FindHub is a React-based campus lost-and-found portal for reporting found items, searching the item registry, verifying ownership, and submitting claims. The interface is designed around secure custody tracking across campus hubs.

## Features

- Login screen for campus users
- FindHub home dashboard with item statistics and quick actions
- Searchable reported-item directory with category, location, and date filters
- Item details and ownership verification flow
- Claim submission form with ownership declaration and validation
- New item reporting form
- Database-backed profiles, notifications, support tickets, item claims, and custody history
- Staff claim review and support response pages
- Validated item-photo uploads (JPEG, PNG, WebP)
- Responsive academic-style interface with shared navigation and custody status indicators

## Application Routes

| Route | Page |
| --- | --- |
| `/` | Login |
| `/home` | FindHub dashboard |
| `/search` | Reported items directory |
| `/claim` | Claim and ownership verification |
| `/report-item` | Report a found item |
| `/notifications` | Notifications and custody updates |

## Tech Stack

- React 19
- React Router
- React Scripts / Create React App
- Lucide React icons
- Material Symbols for interface icons
- CSS stylesheets organized by page

## Getting Started

### Prerequisites

- Node.js and npm

### Install dependencies

From the `lost-found_smart_portal` directory:

```bash
npm install
```

### Start the development server

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in a browser. The development server reloads when source files change.
`npm run dev` is also available as an alias for `npm start`.

### Start the Express API

In a second terminal, from this project directory:

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

The API runs at `http://localhost:5000`. Set `MONGODB_URI` and a stable, random `JWT_SECRET` in `backend/.env`. Without `MONGODB_URI`, the server uses temporary in-memory demo data, which is cleared when it stops. The React app uses `http://localhost:5000/api` by default; set `REACT_APP_API_URL` before building to change it.
In development, clicking **Send OTP** fills `123456`; keep the API running in the second terminal to complete login.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Check API status |
| `GET` | `/api/items?q=&category=&location=&dateWindow=` | Search reported items |
| `GET` | `/api/items/<item_id>` | Read one item record |
| `POST` | `/api/items` | Create an item report |
| `GET` | `/api/items/<item_id>/claims` | List claims for an item |
| `POST` | `/api/items/<item_id>/claims` | Submit an ownership claim |
| `GET` | `/api/claims/<claim_id>` | Read one claim |
| `POST` | `/api/auth/request-otp` | Request a campus email OTP (development flow) |
| `POST` | `/api/auth/login` | Verify OTP and create/update a user |
| `GET` / `PUT` | `/api/profile` | Read or update the signed-in profile |
| `GET` | `/api/profile/activity` | Read saved account activity counts |
| `GET`, `PATCH`, `DELETE` | `/api/notifications` | List, read, and dismiss signed-in notifications |
| `POST` / `GET` | `/api/support` | Create or list signed-in support requests |
| `GET` / `PATCH` | `/api/admin/claims` | Staff claim review queue and review actions |
| `GET` / `POST` | `/api/items/<item_id>/custody` | Read or record item custody events |
| `GET` / `PATCH` | `/api/admin/support` | Staff support queue and response actions |

The Express API stores users, items, claims, notifications, support tickets, and custody events in MongoDB when `MONGODB_URI` is configured. Item photos are validated and stored as small data URLs in MongoDB (up to four JPEG, PNG, or WebP files, 2 MB each). Login issues signed eight-hour bearer tokens; protected routes check the current account and staff role. To grant staff access, add trusted RVU addresses to `STAFF_EMAILS` or `ADMIN_EMAILS` in the backend environment. OTP generation is still development-only; production email delivery must be configured before production login can work.

### Deployment configuration

The API package has `build` and `start` scripts and listens on the hosting platform's `PORT`. For GoDaddy Node.js Hosting, deploy `backend/` as the API app and deploy the React app as a separate static React app. Set `REACT_APP_API_URL` to the deployed API URL plus `/api` before building the React app. Set `CLIENT_ORIGIN` on the API to the exact deployed frontend origin. Set `NODE_ENV=production`, `MONGODB_URI`, and a private random `JWT_SECRET` in the hosting provider's environment settings; never include production secrets in the source archive or Git. Publishing requires an eligible GoDaddy Web Hosting plan. See [GoDaddy's Node.js app requirements](https://developer.godaddy.com/en/docs/api-users/hosting/app-requirements) and [deployment guide](https://developer.godaddy.com/en/docs/api-users/hosting/workflows/deploy-nodejs-app).

## Available Scripts

### `npm start`

Starts the development server.

### `npm test`

Runs the React test runner in watch mode.

### `npm run build`

Creates an optimized production build in the `build` directory.

### `npm run eject`

Ejects the Create React App configuration. This is irreversible and is not required for normal development.

## Project Structure

```text
src/
├── App.jsx              # Router and application entry routes
├── Loginpage.jsx        # Campus login screen
├── Findhubportal.jsx    # Home dashboard
├── Searchpage.jsx       # Search and item directory
├── Claimpage.jsx        # Ownership claim form
├── Reportitem.jsx       # Found-item reporting form
├── Notifications.jsx    # Notification and custody activity page
├── *.css                # Page-specific styles
├── index.js             # React DOM entry point
└── setupTests.js        # Test setup
```

## User Flow

1. Sign in from the login page.
2. Use the home dashboard to search for an item or report a found item.
3. Filter and browse reported items in the directory.
4. Select **View Details & Claim** or **Verify Ownership** to open the claim page.
5. Submit ownership information and the claim declaration for verification.

## Current Implementation

Profiles, dashboard counts, notifications, support tickets, item reports and details, claims, claim review, and custody events use the Express API. The search page keeps its sample records as an offline fallback when the API cannot be reached. The API has in-memory demo storage only for local development when MongoDB is not configured; production startup requires MongoDB and a stable `JWT_SECRET`.

The following production work still remains:

- Email delivery for OTP and account recovery
- A distributed production rate limiter and monitoring beyond the current per-process limits
- Object storage for photos if usage grows beyond the small MongoDB image limits
- Real-time or server-generated item matching
- Production review of staff account provisioning and role assignment
- Automated tests and deployment smoke checks

## Concepts Used

### React components and props

Each page is a reusable component. `App.jsx` passes callback functions to `LoginPage` as props:

```jsx
<LoginPage
	onLoginSuccess={() => navigate("/home")}
	onForgotPassword={() => navigate("/forgot-password")}
/>
```

The child component calls these functions when the user completes an action.

### State with `useState`

State stores values that can change while the user interacts with the page. For example:

```jsx
const [email, setEmail] = useState("");

setEmail("student@rvu.edu.in");
```

The first value is the current state and the second value updates it. Calling the setter causes React to render the updated screen.

### Side effects with `useEffect`

`useEffect` runs code after rendering or when selected state changes. It is useful for timers, API calls, browser events, and local storage. A countdown can be implemented like this:

```jsx
useEffect(() => {
	if (countdown <= 0) return;

	const timer = setInterval(() => {
		setCountdown((value) => value - 1);
	}, 1000);

	return () => clearInterval(timer);
}, [countdown]);
```

The returned function cleans up the timer so multiple timers do not continue running.

### Controlled forms and validation

Inputs use state as their source of truth. The `value` is read from state and `onChange` updates that state. Submit handlers use `preventDefault()`, validate the values, and display errors without reloading the page.

### Routing

React Router maps URLs to components. For example, `/search` renders `Searchpage` and `navigate("/home")` changes the page without a full browser reload.

### Filtering and data-driven rendering

The search page keeps item records in an array, filters them according to the selected values, and uses `.map()` to render one card for each matching item. This same pattern is useful for notifications, categories, and dashboard statistics.

## What to Learn Next

Study these topics in order to build the complete application without AI assistance:

1. **JavaScript fundamentals:** variables, functions, objects, arrays, destructuring, spread syntax, modules, promises, and `async/await`.
2. **HTML and CSS:** semantic forms, accessibility labels, flexbox, grid, responsive design, and browser developer tools.
3. **React fundamentals:** components, JSX, props, `useState`, `useEffect`, lists, conditional rendering, and lifting state up.
4. **React Router:** routes, links, navigation, route parameters, query strings, and protected routes.
5. **Forms and validation:** controlled inputs, client-side validation, server-side validation, error states, and file inputs.
6. **Node.js and Express:** servers, middleware, request and response objects, route handlers, status codes, and JSON APIs.
7. **Databases:** SQL tables and relationships, or MongoDB collections and documents; learn CRUD, indexes, and transactions.
8. **Authentication and security:** password hashing, sessions or tokens, authorization, HTTPS, input sanitization, CORS, CSRF, and rate limiting.
9. **API integration:** `fetch`, loading states, error handling, REST conventions, and connecting React to Express.
10. **Testing:** unit tests, React Testing Library, API tests, and end-to-end tests for login, reporting, searching, and claiming.
11. **Git and deployment:** commits, branches, pull requests, environment variables, production builds, hosting, logs, and backups.
12. **Data structures and problem solving:** stacks, queues, maps, sorting, searching, Big O complexity, and choosing the right structure.

### One complete example: reporting an item

1. A user fills in the React form. State stores the title, category, location, date, and selected image.
2. The submit handler validates required fields and shows an error if a value is missing.
3. React sends the data to an Express endpoint such as `POST /api/items` using `fetch`.
4. Express validates the request again, because browser validation cannot be trusted.
5. The server stores the item in a database and returns a response such as `{ "id": "FH-1050", "status": "pending" }`.
6. React updates its state and displays the new registry number and success message.

This is the central full-stack pattern: **user interface -> HTTP request -> server validation -> database -> response -> updated interface**.

## Build Verification

To verify the application compiles successfully:

```bash
npm run build
```
