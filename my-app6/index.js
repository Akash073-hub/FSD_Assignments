require("dotenv").config();

const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./models/User");
const Child = require("./models/Child");

const app = express();
const port = process.env.PORT || 3000;
const notFoundPage = path.join(__dirname, "views", "404.html");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

function validId(id) {
  return mongoose.isValidObjectId(id);
}

function databaseReady(res) {
  if (mongoose.connection.readyState === 1) return true;
  res.status(503).render("error", {
    title: "Database unavailable",
    message: "The database is not connected. Check MONGODB_URL and try again."
  });
  return false;
}

function validationMessage(error) {
  if (error.name === "ValidationError") {
    return Object.values(error.errors).map((entry) => entry.message).join(" ");
  }
  if (error.code === 11000) return "A user with that email already exists.";
  return "The request could not be completed.";
}

app.get("/", (req, res) => res.redirect("/users"));

app.get("/users", async (req, res, next) => {
  if (!databaseReady(res)) return;
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.render("all-users", { title: "Users", users });
  } catch (error) {
    next(error);
  }
});

app.post("/users", async (req, res) => {
  if (!databaseReady(res)) return;
  try {
    const user = await User.create(req.body);
    res.status(201).redirect(`/users/${user._id}`);
  } catch (error) {
    res.status(400).render("error", { title: "Could not create user", message: validationMessage(error) });
  }
});

app.get("/users/search/:name", async (req, res, next) => {
  if (!databaseReady(res)) return;
  try {
    const name = String(req.params.name).trim();
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const users = await User.find({ firstName: new RegExp(`^${escapedName}`, "i") });
    res.render("all-users", { title: `Search: ${name}`, users, searchTerm: name });
  } catch (error) {
    next(error);
  }
});

app.get("/users/:id", async (req, res, next) => {
  if (!validId(req.params.id)) return res.status(404).sendFile(notFoundPage);
  if (!databaseReady(res)) return;
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).sendFile(notFoundPage);
    const children = await Child.find({ parentId: user._id }).sort({ createdAt: -1 });
    res.render("profile", { title: `${user.firstName}'s Profile`, user, children });
  } catch (error) {
    next(error);
  }
});

app.post("/users/:id/children", async (req, res) => {
  if (!validId(req.params.id)) return res.status(404).sendFile(notFoundPage);
  if (!databaseReady(res)) return;
  try {
    const parent = await User.findById(req.params.id);
    if (!parent) return res.status(404).sendFile(notFoundPage);
    await Child.create({ ...req.body, parentId: parent._id });
    res.redirect(`/users/${parent._id}`);
  } catch (error) {
    res.status(400).render("error", { title: "Could not add child", message: validationMessage(error) });
  }
});

app.get("/users/:id/children", async (req, res, next) => {
  if (!validId(req.params.id)) return res.status(400).json({ message: "Invalid user ID." });
  if (!databaseReady(res)) return;
  try {
    const user = await User.findById(req.params.id).select("firstName lastName");
    if (!user) return res.status(404).json({ message: "User not found." });
    const children = await Child.find({ parentId: user._id }).sort({ createdAt: -1 });
    res.json({ message: "Children fetched successfully.", user, children });
  } catch (error) {
    next(error);
  }
});

app.get("/users/:id/children/count", async (req, res, next) => {
  if (!validId(req.params.id)) return res.status(400).json({ message: "Invalid user ID." });
  if (!databaseReady(res)) return;
  try {
    const count = await Child.countDocuments({ parentId: req.params.id });
    res.json({ userId: req.params.id, count });
  } catch (error) {
    next(error);
  }
});

app.get("/users/:id/children/:childId", async (req, res, next) => {
  const { id, childId } = req.params;
  if (!validId(id) || !validId(childId)) return res.status(404).sendFile(notFoundPage);
  if (!databaseReady(res)) return;
  try {
    const child = await Child.findOne({ _id: childId, parentId: id }).populate("parentId", "firstName lastName");
    if (!child) return res.status(404).sendFile(notFoundPage);
    res.render("child", { title: `${child.firstName}'s Details`, child });
  } catch (error) {
    next(error);
  }
});

app.patch("/children/:id", async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ message: "Invalid child ID." });
  if (!databaseReady(res)) return;
  try {
    const fields = ["firstName", "lastName", "age", "email"];
    const updates = Object.fromEntries(fields.filter((field) => req.body[field] !== undefined).map((field) => [field, req.body[field]]));
    const child = await Child.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!child) return res.status(404).json({ message: "Child Not Found" });
    res.json({ message: "Child updated successfully.", child });
  } catch (error) {
    res.status(400).json({ message: validationMessage(error) });
  }
});

app.delete("/children/:id", async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ message: "Invalid child ID." });
  if (!databaseReady(res)) return;
  try {
    const child = await Child.findByIdAndDelete(req.params.id);
    if (!child) return res.status(404).json({ message: "Child Not Found" });
    res.json({ message: "Child deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Database error while deleting child." });
  }
});

app.use((req, res) => res.status(404).sendFile(notFoundPage));
app.use((error, req, res, next) => {
  console.error(error);
  if (res.headersSent) return next(error);
  res.status(500).render("error", { title: "Server error", message: "Something went wrong while processing your request." });
});

if (process.env.MONGODB_URL) {
  mongoose.connect(process.env.MONGODB_URL, { serverSelectionTimeoutMS: 5000 })
    .then(() => console.log("MongoDB connected"))
    .catch((error) => console.error("MongoDB connection failed:", error.message));
} else {
  console.warn("MONGODB_URL is missing. Add it to .env before using database routes.");
}

app.listen(port, () => console.log(`Family Management System running at http://localhost:${port}`));

module.exports = app;
