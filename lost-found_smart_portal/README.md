# FindHub Smart Lost & Found Portal

FindHub is a React-based campus lost-and-found portal for reporting found items, searching the item registry, verifying ownership, and submitting claims. The interface is designed around secure custody tracking across campus hubs.

## Features

- Login screen for campus users
- FindHub home dashboard with item statistics and quick actions
- Searchable reported-item directory with category, location, and date filters
- Item details and ownership verification flow
- Claim submission form with ownership declaration and validation
- New item reporting form
- Notifications for AI matches, custody updates, and claim verification
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

## Build Verification

To verify the application compiles successfully:

```bash
npm run build
```