# Mini User and Family Management System

Express, EJS, MongoDB, and Mongoose assignment for managing users and their children.

## Setup

```bash
cp .env.example .env
npm install
npm start
```

Set `MONGODB_URL` in `.env` to a MongoDB connection string. The default port is `3000`.

## Routes

- `GET /users` lists users and provides the create-user form.
- `POST /users` creates a user.
- `GET /users/:id` displays a user profile and only that user's children.
- `POST /users/:id/children` creates a child with the parent's MongoDB ID.
- `GET /users/:id/children` returns only children belonging to that user.
- `GET /users/:id/children/:childId` verifies both IDs before displaying a child.
- `PATCH /children/:id` updates child information.
- `DELETE /children/:id` removes a child.
- `GET /users/:id/children/count` returns the child count.
- `GET /users/search/:name` searches by first name.
