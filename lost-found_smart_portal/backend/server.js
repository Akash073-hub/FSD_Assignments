import "dotenv/config";
import crypto from "node:crypto";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";

const app = express();
const port = Number(process.env.PORT || 5000);
const uri = process.env.MONGODB_URI;
const mongoConnected = Boolean(uri);
app.use(cors({ origin: (process.env.CLIENT_ORIGIN || "http://localhost:3000").split(",") }));
app.use(express.json({ limit: "1mb" }));

const itemSchema = new mongoose.Schema({
  registryId: { type: String, unique: true, index: true }, title: { type: String, required: true },
  category: { type: String, required: true }, location: { type: String, required: true }, color: { type: String, required: true },
  date: { type: String, required: true }, description: { type: String, default: "" }, status: { type: String, default: "In Storage" },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, reportedByEmail: { type: String, default: "" },
}, { timestamps: true });
itemSchema.index({ title: "text", description: "text", category: "text", location: "text", color: "text" });
const claimSchema = new mongoose.Schema({ item: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true }, itemId: String, role: String, email: String, narrative: String, usn: String, phone: String, altContact: String, status: { type: String, default: "pending" } }, { timestamps: true });
const userSchema = new mongoose.Schema({ fullName: { type: String, required: true }, email: { type: String, unique: true, lowercase: true }, phone: String, program: String, role: { type: String, default: "student" } }, { timestamps: true });
const notificationSchema = new mongoose.Schema({ userEmail: { type: String, index: true }, title: String, message: String, type: String, read: { type: Boolean, default: false } }, { timestamps: true });
const ticketSchema = new mongoose.Schema({ name: String, email: String, subject: String, message: String, status: { type: String, default: "open" } }, { timestamps: true });
const Item = mongoose.model("Item", itemSchema), Claim = mongoose.model("Claim", claimSchema), User = mongoose.model("User", userSchema), Notification = mongoose.model("Notification", notificationSchema), SupportTicket = mongoose.model("SupportTicket", ticketSchema);

// In-memory fallback keeps the API usable before a MongoDB URI is configured.
const memory = { items: [], claims: [], users: [], notifications: [], tickets: [] };
const seeds = [
  ["REG-8492", "Apple AirPods Pro (2nd Gen)", "Electronics", "Main Library Wing (Floor 3)", "White", "2024-10-24", "Case engraved with initials 'MR'. White MagSafe case in mint condition."],
  ["REG-8493", "Black Leather Bifold Wallet", "IDs & Wallets", "Dining Commons West", "Black", "2024-10-23", "Contains student ID and transit pass. Bellroy brand, textured grain leather."],
  ["REG-8494", "Calculus: Early Transcendentals (9th Ed)", "Books & Stationery", "Science Complex Room 204", "Blue", "2024-10-22", "Hardcover with blue ribbon bookmark and marginal study notes."],
  ["REG-8495", "Dell XPS 15 Charger (130W USB-C)", "Electronics", "Engineering Lab B", "Black", "2024-10-24", "Black braided cable with white identification tag."],
  ["REG-8496", "Hydro Flask 32oz Wide Mouth (Cobalt Blue)", "Accessories", "Sports Center Gym", "Cobalt Blue", "2024-10-21", "Has silver university crest sticker and rubberized boot on base.", "Claim In Progress"],
  ["REG-8497", "JBL Tune 510BT Wireless Headphones", "Electronics", "Student Union Lounge", "Matte Black", "2024-10-20", "Matte black finish, minimal wear."],
  ["REG-8498", "Keys on Red RVU Lanyard", "Keys & Wallets", "North Campus Gate 2", "Red", "2024-10-24", "Three brass keys with black automotive key fob."],
  ["REG-8499", "North Face Borealis Backpack (Navy)", "Bags & Apparel", "Transit Pavilion", "Navy", "2024-10-19", "Left on bench near shuttle stop."]
].map(([registryId, title, category, location, color, date, description, status = "In Storage"]) => ({ _id: registryId, registryId, title, category, location, color, date, description, status }));
if (!mongoConnected) memory.items.push(...seeds);

const asyncRoute = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const fail = (res, message, status = 400) => res.status(status).json({ error: message });
const validEmail = (email) => typeof email === "string" && /^[^\s@]+@rvu\.edu\.in$/i.test(email.trim());
const getItem = (id) => mongoConnected ? Item.findOne({ $or: [{ _id: mongoose.isValidObjectId(id) ? id : null }, { registryId: id }] }) : Promise.resolve(memory.items.find((item) => item.registryId === id || item._id === id) || null);
const listItems = async (filters = {}) => {
  if (mongoConnected) {
    const query = {};
    if (filters.q) query.$text = { $search: filters.q };
    if (filters.category && !/^(all categories|all)$/i.test(filters.category)) query.category = new RegExp(filters.category, "i");
    if (filters.location && !/^(everywhere|all)$/i.test(filters.location)) query.location = new RegExp(filters.location, "i");
    if (filters.dateWindow && filters.dateWindow.toLowerCase() !== "all time") { const days = /24 hours/i.test(filters.dateWindow) ? 1 : /7 days/i.test(filters.dateWindow) ? 7 : 30; query.date = { $gte: new Date(Date.now() - days * 86400000).toISOString().slice(0, 10) }; }
    return Item.find(query).sort({ date: -1, createdAt: -1 }).lean();
  }
  return memory.items.filter((item) => {
    const haystack = [item.registryId, item.title, item.description, item.category, item.location, item.color].join(" ").toLowerCase();
    return (!filters.q || haystack.includes(filters.q.toLowerCase())) && (!filters.category || /^(all categories|all)$/i.test(filters.category) || item.category.toLowerCase().includes(filters.category.toLowerCase())) && (!filters.location || /^(everywhere|all)$/i.test(filters.location) || item.location.toLowerCase().includes(filters.location.toLowerCase()));
  }).sort((a, b) => b.date.localeCompare(a.date));
};

app.get("/api/health", (_req, res) => res.json({ status: "ok", storage: mongoConnected && mongoose.connection.readyState === 1 ? "mongodb" : "memory", mongoConfigured: mongoConnected }));
app.get("/api/items", asyncRoute(async (req, res) => { const items = await listItems(req.query); res.json({ items, count: items.length }); }));
app.get("/api/items/:id", asyncRoute(async (req, res) => { const item = await getItem(req.params.id); item ? res.json({ item }) : fail(res, "Item was not found.", 404); }));
app.post("/api/items", asyncRoute(async (req, res) => {
  const { title, category, location, color, date, description = "", reportedByEmail = "" } = req.body || {};
  if (![title, category, location, color, date].every((v) => typeof v === "string" && v.trim())) return fail(res, "title, category, location, color, and date are required.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date))) return fail(res, "date must use YYYY-MM-DD format.");
  const items = await listItems(); const last = Math.max(8499, ...items.map((i) => Number(String(i.registryId).replace("REG-", "")) || 0));
  const values = { registryId: `REG-${last + 1}`, title: title.trim(), category: category.trim(), location: location.trim(), color: color.trim(), date, description: String(description).trim(), status: "In Storage", reportedByEmail: String(reportedByEmail).trim().toLowerCase() };
  const item = mongoConnected ? await Item.create(values) : { ...values, _id: values.registryId, createdAt: new Date() };
  if (!mongoConnected) memory.items.push(item);
  res.status(201).json({ item, registryId: item.registryId });
}));
app.get("/api/items/:id/claims", asyncRoute(async (req, res) => { const item = await getItem(req.params.id); if (!item) return fail(res, "Item was not found.", 404); const claims = mongoConnected ? await Claim.find({ item: item._id }).sort({ createdAt: -1 }).lean() : memory.claims.filter((c) => c.itemId === item.registryId); res.json({ claims, count: claims.length }); }));
app.post("/api/items/:id/claims", asyncRoute(async (req, res) => {
  const item = await getItem(req.params.id); if (!item) return fail(res, "The item you are claiming was not found.", 404);
  const { role, email, narrative, usn = "", phone, altContact = "", agreed } = req.body || {};
  if (!role || !email || !narrative || !phone) return fail(res, "role, email, narrative, and phone are required.");
  if (!validEmail(email)) return fail(res, "Email must use the @rvu.edu.in domain.");
  if (!["owner", "finder"].includes(role)) return fail(res, "role must be 'owner' or 'finder'.");
  if (agreed !== true) return fail(res, "The custody declaration must be accepted.");
  if (narrative.trim().length < 20) return fail(res, "narrative must be at least 20 characters.");
  if (!/^\d{10}$/.test(phone.replace(/\s/g, ""))) return fail(res, "phone must contain 10 digits.");
  const values = { item: item._id, itemId: item.registryId, role, email: email.trim().toLowerCase(), narrative: narrative.trim(), usn: String(usn).trim(), phone: phone.trim(), altContact: String(altContact).trim(), status: "pending" };
  const claim = mongoConnected ? await Claim.create(values) : { ...values, _id: crypto.randomUUID(), id: crypto.randomUUID(), createdAt: new Date() };
  if (!mongoConnected) memory.claims.push(claim);
  if (mongoConnected) await Item.updateOne({ _id: item._id }, { $set: { status: "Claim In Progress" } }); else item.status = "Claim In Progress";
  res.status(201).json({ claim });
}));
app.get("/api/claims/:id", asyncRoute(async (req, res) => { const claim = mongoConnected ? await Claim.findById(req.params.id).lean() : memory.claims.find((c) => c.id === req.params.id || c._id === req.params.id); claim ? res.json({ claim }) : fail(res, "Claim was not found.", 404); }));

// OTP is a development flow only; production delivery needs a mail provider.
const otpStore = new Map();
app.post("/api/auth/request-otp", (req, res) => { const email = String(req.body?.email || "").trim().toLowerCase(); if (!validEmail(email)) return fail(res, "Use a valid @rvu.edu.in email address."); const otp = process.env.DEV_OTP || String(crypto.randomInt(100000, 1000000)); otpStore.set(email, { otp, expires: Date.now() + 5 * 60 * 1000 }); res.json({ message: "OTP generated. Configure an email provider for delivery.", ...(process.env.NODE_ENV !== "production" ? { developmentOtp: otp } : {}) }); });
app.post("/api/auth/login", asyncRoute(async (req, res) => { const { fullName, email, phone, otp, agreed } = req.body || {}; const normalized = String(email || "").trim().toLowerCase(); if (!validEmail(normalized)) return fail(res, "Use a valid @rvu.edu.in email address."); if (!fullName?.trim()) return fail(res, "Full name is required."); if (!agreed) return fail(res, "You must agree to campus policies."); const saved = otpStore.get(normalized); if (!saved || saved.expires < Date.now() || saved.otp !== String(otp)) return fail(res, "OTP is invalid or expired.", 401); otpStore.delete(normalized); const values = { fullName: fullName.trim(), email: normalized, phone: String(phone || "").trim() }; let user; if (mongoConnected) user = await User.findOneAndUpdate({ email: normalized }, { $set: values }, { upsert: true, new: true }).lean(); else { user = memory.users.find((u) => u.email === normalized); if (!user) { user = { _id: crypto.randomUUID(), ...values, role: "student" }; memory.users.push(user); } else Object.assign(user, values); } res.json({ user, token: crypto.randomUUID() }); }));
app.get("/api/users/:email", asyncRoute(async (req, res) => { const email = String(req.params.email).toLowerCase(); const user = mongoConnected ? await User.findOne({ email }).lean() : memory.users.find((u) => u.email === email); user ? res.json({ user }) : fail(res, "User was not found.", 404); }));
app.put("/api/users/:email", asyncRoute(async (req, res) => { const email = String(req.params.email).toLowerCase(); const { fullName, phone, program } = req.body || {}; if (!fullName?.trim()) return fail(res, "Full name is required."); if (phone && !/^\d{10}$/.test(phone.replace(/\s/g, ""))) return fail(res, "Phone must contain 10 digits."); let user; if (mongoConnected) user = await User.findOneAndUpdate({ email }, { $set: { fullName: fullName.trim(), phone: String(phone || "").trim(), program: String(program || "") } }, { new: true }).lean(); else { user = memory.users.find((u) => u.email === email); if (user) Object.assign(user, { fullName: fullName.trim(), phone: String(phone || "").trim(), program: String(program || "") }); } user ? res.json({ user }) : fail(res, "User was not found. Sign in first.", 404); }));
app.get("/api/notifications", asyncRoute(async (req, res) => { const email = String(req.query.email || "").toLowerCase(); const notifications = mongoConnected ? await Notification.find(email ? { userEmail: email } : {}).sort({ createdAt: -1 }).lean() : memory.notifications.filter((n) => !email || n.userEmail === email); res.json({ notifications, count: notifications.length }); }));
app.patch("/api/notifications/:id", asyncRoute(async (req, res) => { const { read } = req.body || {}; const notification = mongoConnected ? await Notification.findByIdAndUpdate(req.params.id, { $set: { read: Boolean(read) } }, { new: true }).lean() : memory.notifications.find((n) => n._id === req.params.id); if (notification && !mongoConnected) notification.read = Boolean(read); notification ? res.json({ notification }) : fail(res, "Notification was not found.", 404); }));
app.post("/api/support", asyncRoute(async (req, res) => { const { name, email, subject, message } = req.body || {}; if (![name, email, subject, message].every((v) => typeof v === "string" && v.trim())) return fail(res, "name, email, subject, and message are required."); if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail(res, "Enter a valid email address."); const ticket = mongoConnected ? await SupportTicket.create({ name: name.trim(), email: email.trim().toLowerCase(), subject: subject.trim(), message: message.trim() }) : { _id: crypto.randomUUID(), name: name.trim(), email: email.trim().toLowerCase(), subject: subject.trim(), message: message.trim(), status: "open", createdAt: new Date() }; if (!mongoConnected) memory.tickets.push(ticket); res.status(201).json({ ticket, message: "Your support request has been received." }); }));

app.use((err, _req, res, _next) => { console.error(err); res.status(err.name === "ValidationError" ? 400 : 500).json({ error: err.name === "ValidationError" ? err.message : "The server encountered an unexpected error." }); });
if (mongoConnected) mongoose.connect(uri).then(async () => {
  if (await Item.estimatedDocumentCount() === 0) {
    await Item.insertMany(seeds.map(({ _id, ...item }) => item));
  }
  app.listen(port, () => console.log(`FindHub API listening on ${port} (MongoDB)`));
}).catch((error) => { console.error("MongoDB connection failed:", error.message); process.exit(1); });
else app.listen(port, () => console.log(`FindHub API listening on ${port} (memory demo mode; set MONGODB_URI to persist data)`));
