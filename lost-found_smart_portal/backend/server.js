import "dotenv/config";
import crypto from "node:crypto";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";

const app = express();
const port = Number(process.env.PORT || 5000);
const mongoUri = process.env.MONGODB_URI;
const mongoConfigured = Boolean(mongoUri);
const jwtSecret = process.env.JWT_SECRET || crypto.randomBytes(32).toString("hex");
if (!process.env.JWT_SECRET) console.warn("JWT_SECRET is unset; login tokens will be invalidated when the server restarts.");
if (process.env.NODE_ENV === "production" && !process.env.JWT_SECRET) throw new Error("Set JWT_SECRET before starting in production.");
if (process.env.NODE_ENV === "production" && !mongoConfigured) throw new Error("Set MONGODB_URI before starting in production.");
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:3000,http://127.0.0.1:3000").split(",").map((value) => value.trim());

app.disable("x-powered-by");
app.use((_, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  if (process.env.NODE_ENV === "production") res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  next();
});
app.use(cors({ origin(origin, callback) { if (!origin || allowedOrigins.includes(origin)) return callback(null, true); return callback(new Error("Origin is not allowed by CORS.")); }, methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], allowedHeaders: ["Content-Type", "Authorization"] }));
app.use(express.json({ limit: "12mb", strict: true }));

const imageSchema = new mongoose.Schema({ dataUrl: { type: String, required: true }, contentType: { type: String, required: true }, name: { type: String, default: "item-photo" } }, { _id: false });
const itemSchema = new mongoose.Schema({
  registryId: { type: String, unique: true, index: true }, title: { type: String, required: true, trim: true, maxlength: 120 },
  category: { type: String, required: true, trim: true, maxlength: 80 }, location: { type: String, required: true, trim: true, maxlength: 180 }, color: { type: String, required: true, trim: true, maxlength: 60 },
  date: { type: String, required: true }, description: { type: String, default: "", maxlength: 1500 }, status: { type: String, enum: ["In Storage", "Claim In Progress", "Released", "Archived"], default: "In Storage" },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, reportedByEmail: { type: String, default: "", index: true }, images: { type: [imageSchema], default: [] },
}, { timestamps: true });
itemSchema.index({ title: "text", description: "text", category: "text", location: "text", color: "text" });
const claimSchema = new mongoose.Schema({ item: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true }, itemId: { type: String, index: true }, role: { type: String, enum: ["owner", "finder"], required: true }, email: { type: String, required: true, index: true }, narrative: { type: String, required: true, maxlength: 2500 }, usn: String, phone: String, altContact: String, status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }, reviewedBy: String, reviewNote: { type: String, maxlength: 1000 }, reviewedAt: Date }, { timestamps: true });
const userSchema = new mongoose.Schema({ fullName: { type: String, required: true, trim: true, maxlength: 100 }, email: { type: String, unique: true, lowercase: true, index: true }, phone: { type: String, default: "" }, program: { type: String, default: "RV University student", maxlength: 120 }, role: { type: String, enum: ["student", "staff", "admin"], default: "student" } }, { timestamps: true });
const notificationSchema = new mongoose.Schema({ userEmail: { type: String, required: true, index: true }, title: { type: String, required: true, maxlength: 160 }, message: { type: String, required: true, maxlength: 1000 }, type: { type: String, enum: ["item", "claim", "custody", "support", "system"], default: "system" }, itemId: String, claimId: String, read: { type: Boolean, default: false }, dismissed: { type: Boolean, default: false } }, { timestamps: true });
const ticketSchema = new mongoose.Schema({ name: { type: String, required: true, maxlength: 100 }, email: { type: String, required: true, index: true }, subject: { type: String, required: true, maxlength: 140 }, message: { type: String, required: true, maxlength: 3000 }, status: { type: String, enum: ["open", "in_progress", "resolved"], default: "open" }, response: { type: String, default: "", maxlength: 2000 } }, { timestamps: true });
const custodySchema = new mongoose.Schema({ item: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true }, itemId: { type: String, index: true }, event: { type: String, required: true, maxlength: 120 }, location: { type: String, required: true, maxlength: 180 }, locker: { type: String, default: "", maxlength: 80 }, status: { type: String, enum: ["In Storage", "Claim In Progress", "Released", "Archived"], default: "In Storage" }, notes: { type: String, default: "", maxlength: 1000 }, recordedBy: { type: String, required: true } }, { timestamps: true });
const Item = mongoose.model("Item", itemSchema);
const Claim = mongoose.model("Claim", claimSchema);
const User = mongoose.model("User", userSchema);
const Notification = mongoose.model("Notification", notificationSchema);
const SupportTicket = mongoose.model("SupportTicket", ticketSchema);
const CustodyEvent = mongoose.model("CustodyEvent", custodySchema);

const memory = { items: [], claims: [], users: [], notifications: [], tickets: [], custody: [] };
const seeds = [
  ["REG-8492", "Apple AirPods Pro (2nd Gen)", "Electronics", "Main Library Wing (Floor 3)", "White", "2024-10-24", "Case engraved with initials 'MR'. White MagSafe case in mint condition."],
  ["REG-8493", "Black Leather Bifold Wallet", "IDs & Wallets", "Dining Commons West", "Black", "2024-10-23", "Contains student ID and transit pass. Bellroy brand, textured grain leather."],
  ["REG-8494", "Calculus: Early Transcendentals (9th Ed)", "Books & Stationery", "Science Complex Room 204", "Blue", "2024-10-22", "Hardcover with blue ribbon bookmark and marginal study notes."],
  ["REG-8495", "Dell XPS 15 Charger (130W USB-C)", "Electronics", "Engineering Lab B", "Black", "2024-10-24", "Black braided cable with white identification tag."],
  ["REG-8496", "Hydro Flask 32oz Wide Mouth (Cobalt Blue)", "Accessories", "Sports Center Gym", "Cobalt Blue", "2024-10-21", "Has silver university crest sticker and rubberized boot on base.", "Claim In Progress"],
  ["REG-8497", "JBL Tune 510BT Wireless Headphones", "Electronics", "Student Union Lounge", "Matte Black", "2024-10-20", "Matte black finish, minimal wear."],
  ["REG-8498", "Keys on Red RVU Lanyard", "Keys & Wallets", "North Campus Gate 2", "Red", "2024-10-24", "Three brass keys with black automotive key fob."],
  ["REG-8499", "North Face Borealis Backpack (Navy)", "Bags & Apparel", "Transit Pavilion", "Navy", "2024-10-19", "Left on bench near shuttle stop."]
].map(([registryId, title, category, location, color, date, description, status = "In Storage"]) => ({ registryId, title, category, location, color, date, description, status }));
if (!mongoConfigured) memory.items.push(...seeds.map((item) => ({ ...item, _id: item.registryId })));

const asyncRoute = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const fail = (res, message, status = 400) => res.status(status).json({ error: message });
const publicItem = (item) => {
  if (!item) return item;
  const record = typeof item.toObject === "function" ? item.toObject() : { ...item };
  delete record.reportedByEmail;
  delete record.reportedBy;
  return record;
};
const validEmail = (email) => typeof email === "string" && /^[^\s@]+@rvu\.edu\.in$/i.test(email.trim());
const clean = (value, max = 1000) => typeof value === "string" ? value.trim().slice(0, max) : "";
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const rolesFromEnv = (name) => (process.env[name] || "").split(",").map((value) => value.trim().toLowerCase()).filter(Boolean);

function signToken(user) {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(JSON.stringify({ sub: String(user._id), email: user.email, role: user.role, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8 })).toString("base64url");
  const data = `${header}.${payload}`;
  return `${data}.${crypto.createHmac("sha256", jwtSecret).update(data).digest("base64url")}`;
}
function readToken(token) {
  const parts = String(token || "").split(".");
  if (parts.length !== 3) return null;
  const data = `${parts[0]}.${parts[1]}`;
  const expected = crypto.createHmac("sha256", jwtSecret).update(data).digest();
  let supplied;
  try { supplied = Buffer.from(parts[2], "base64url"); } catch { return null; }
  if (expected.length !== supplied.length || !crypto.timingSafeEqual(expected, supplied)) return null;
  try { const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString()); return payload.exp > Date.now() / 1000 ? payload : null; } catch { return null; }
}
async function requireAuth(req, res, next) {
  const token = req.headers.authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  const payload = readToken(token);
  if (!payload) return fail(res, "Sign in again to continue.", 401);
  try {
    if (mongoConfigured) {
      const account = await User.findOne({ email: payload.email }).select("email role").lean();
      if (!account) return fail(res, "Account is no longer available. Sign in again.", 401);
      req.user = { ...payload, email: account.email, role: account.role };
    } else req.user = payload;
    next();
  } catch (error) { next(error); }
}
const requireStaff = (req, res, next) => {
  if (!req.user || !["staff", "admin"].includes(req.user.role)) return fail(res, "Staff access is required.", 403);
  next();
};
async function getItem(id) {
  if (mongoConfigured) return Item.findOne({ $or: [{ _id: mongoose.isValidObjectId(id) ? id : null }, { registryId: id }] });
  return memory.items.find((item) => item.registryId === id || item._id === id) || null;
}
async function listItems(filters = {}) {
  if (mongoConfigured) {
    const query = {};
    if (filters.q) query.$text = { $search: clean(filters.q, 100) };
    if (filters.category && !/^(all categories|all)$/i.test(filters.category)) query.category = new RegExp(escapeRegex(clean(filters.category, 80)), "i");
    if (filters.location && !/^(everywhere|all)$/i.test(filters.location)) query.location = new RegExp(escapeRegex(clean(filters.location, 120)), "i");
    if (filters.dateWindow && filters.dateWindow.toLowerCase() !== "all time") { const days = /24 hours/i.test(filters.dateWindow) ? 1 : /7 days/i.test(filters.dateWindow) ? 7 : 30; query.date = { $gte: new Date(Date.now() - days * 86400000).toISOString().slice(0, 10) }; }
    return Item.find(query).select("-images").sort({ date: -1, createdAt: -1 }).lean();
  }
  return memory.items.filter((item) => { const haystack = [item.registryId, item.title, item.description, item.category, item.location, item.color].join(" ").toLowerCase(); return (!filters.q || haystack.includes(clean(filters.q, 100).toLowerCase())) && (!filters.category || /^(all categories|all)$/i.test(filters.category) || item.category.toLowerCase().includes(filters.category.toLowerCase())) && (!filters.location || /^(everywhere|all)$/i.test(filters.location) || item.location.toLowerCase().includes(filters.location.toLowerCase())); }).sort((a, b) => b.date.localeCompare(a.date));
}
async function addNotification(userEmail, values) {
  if (!userEmail) return;
  const payload = { userEmail: userEmail.toLowerCase(), ...values };
  if (mongoConfigured) return Notification.create(payload);
  const notice = { ...payload, _id: crypto.randomUUID(), read: false, dismissed: false, createdAt: new Date() };
  memory.notifications.push(notice);
  return notice;
}
function validateImages(images) {
  if (images === undefined) return { value: [] };
  if (!Array.isArray(images) || images.length > 4) return { error: "Upload no more than 4 item photos." };
  const value = [];
  for (const image of images) {
    if (!image || !["image/jpeg", "image/png", "image/webp"].includes(image.contentType) || typeof image.dataUrl !== "string") return { error: "Photos must be JPEG, PNG, or WebP images." };
    const prefix = `data:${image.contentType};base64,`;
    if (!image.dataUrl.startsWith(prefix)) return { error: "An uploaded photo has invalid image data." };
    const base64 = image.dataUrl.slice(prefix.length);
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64) || Buffer.byteLength(base64, "base64") > 2 * 1024 * 1024) return { error: "Each photo must be smaller than 2 MB." };
    const bytes = Buffer.from(base64, "base64");
    const validSignature = image.contentType === "image/jpeg" ? bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff : image.contentType === "image/png" ? bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) : bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP";
    if (!validSignature) return { error: "The photo content does not match its image type." };
    value.push({ dataUrl: image.dataUrl, contentType: image.contentType, name: clean(image.name, 120) || "item-photo" });
  }
  return { value };
}

const otpStore = new Map();
const otpAttempts = new Map();
const loginAttempts = new Map();
const writeBuckets = new Map();
function limitWrites(req, res, next) {
  const key = req.user?.sub || req.ip;
  const now = Date.now();
  const recent = (writeBuckets.get(key) || []).filter((time) => now - time < 60 * 1000);
  if (recent.length >= 40) return fail(res, "Too many changes in a short time. Please wait a minute and retry.", 429);
  recent.push(now); writeBuckets.set(key, recent); next();
}
app.get("/api/health", (_req, res) => res.json({ status: "ok", storage: mongoConfigured && mongoose.connection.readyState === 1 ? "mongodb" : "memory", mongoConfigured }));
app.get("/api/dashboard/stats", requireAuth, asyncRoute(async (_req, res) => {
  if (!mongoConfigured) return res.json({ totalTracked: memory.items.length, activeCases: memory.items.filter((item) => ["In Storage", "Claim In Progress"].includes(item.status)).length, inCustody: memory.items.filter((item) => item.status === "In Storage").length, reunited: memory.items.filter((item) => item.status === "Released").length });
  const [totalTracked, activeCases, inCustody, reunited] = await Promise.all([Item.countDocuments(), Item.countDocuments({ status: { $in: ["In Storage", "Claim In Progress"] } }), Item.countDocuments({ status: "In Storage" }), Item.countDocuments({ status: "Released" })]);
  res.json({ totalTracked, activeCases, inCustody, reunited });
}));
app.get("/api/items", asyncRoute(async (req, res) => { const items = (await listItems(req.query)).map(publicItem); res.json({ items, count: items.length }); }));
app.get("/api/items/:id", asyncRoute(async (req, res) => { const item = await getItem(req.params.id); item ? res.json({ item: publicItem(item) }) : fail(res, "Item was not found.", 404); }));
app.post("/api/items", requireAuth, limitWrites, asyncRoute(async (req, res) => {
  const { title, category, location, color, date, description = "" } = req.body || {};
  if (![title, category, location, color, date].every((value) => typeof value === "string" && value.trim())) return fail(res, "Title, category, location, color, and date are required.");
  if (title.trim().length > 120 || category.trim().length > 80 || location.trim().length > 180 || String(description).length > 1500) return fail(res, "One or more item fields are too long.");
  const parsedDate = /^\d{4}-\d{2}-\d{2}$/.test(date) ? new Date(`${date}T00:00:00Z`) : null;
  if (!parsedDate || Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== date) return fail(res, "Date must use a valid YYYY-MM-DD date.");
  if (typeof description !== "string" || description.trim().length < 10) return fail(res, "Description must contain at least 10 characters.");
  const photos = validateImages(req.body.images); if (photos.error) return fail(res, photos.error);
  const existingItems = mongoConfigured ? await Item.find({}, { registryId: 1 }).lean() : memory.items;
  const nextNumber = Math.max(8499, ...existingItems.map((item) => Number(String(item.registryId).replace("REG-", "")) || 0)) + 1;
  const values = { registryId: `REG-${nextNumber}`, title: title.trim(), category: category.trim(), location: location.trim(), color: color.trim(), date, description: clean(description, 1500), status: "In Storage", reportedBy: mongooseConnectedUserId(req.user.sub), reportedByEmail: req.user.email, images: photos.value };
  const item = mongoConfigured ? await Item.create(values) : { ...values, _id: values.registryId, createdAt: new Date() };
  if (!mongoConfigured) memory.items.push(item);
  await addNotification(req.user.email, { title: "Item report received", message: `${item.title} was added to the FindHub registry.`, type: "item", itemId: item.registryId });
  res.status(201).json({ item, registryId: item.registryId });
}));
function mongooseConnectedUserId(id) { return mongoose.isValidObjectId(id) ? id : null; }
app.get("/api/items/:id/claims", requireAuth, asyncRoute(async (req, res) => { const item = await getItem(req.params.id); if (!item) return fail(res, "Item was not found.", 404); const claims = mongoConfigured ? await Claim.find({ item: item._id, ...(req.user.role === "staff" || req.user.role === "admin" ? {} : { email: req.user.email }) }).sort({ createdAt: -1 }).lean() : memory.claims.filter((claim) => claim.itemId === item.registryId && (req.user.role !== "student" || claim.email === req.user.email)); res.json({ claims, count: claims.length }); }));
app.post("/api/items/:id/claims", requireAuth, limitWrites, asyncRoute(async (req, res) => {
  const item = await getItem(req.params.id); if (!item) return fail(res, "The item you are claiming was not found.", 404);
  const { role, narrative, usn = "", phone, altContact = "", agreed } = req.body || {};
  if (!role || !narrative || !phone) return fail(res, "Role, claim details, and phone are required.");
  if (!["owner", "finder"].includes(role)) return fail(res, "Role must be owner or finder.");
  if (agreed !== true) return fail(res, "The custody declaration must be accepted.");
  if (typeof narrative !== "string" || narrative.trim().length < 20 || narrative.length > 2500) return fail(res, "Claim details must be between 20 and 2500 characters.");
  if (!/^\d{10}$/.test(String(phone).replace(/\s/g, ""))) return fail(res, "Phone must contain 10 digits.");
  if (req.body.email && String(req.body.email).trim().toLowerCase() !== req.user.email) return fail(res, "Claims must use the email address signed in to FindHub.");
  const values = { item: item._id, itemId: item.registryId, role, email: req.user.email, narrative: narrative.trim(), usn: clean(usn, 40), phone: clean(phone, 30), altContact: clean(altContact, 120), status: "pending" };
  const claim = mongoConfigured ? await Claim.create(values) : { ...values, _id: crypto.randomUUID(), id: crypto.randomUUID(), createdAt: new Date() };
  if (!mongoConfigured) memory.claims.push(claim);
  if (mongoConfigured) await Item.updateOne({ _id: item._id }, { $set: { status: "Claim In Progress" } }); else item.status = "Claim In Progress";
  await addNotification(req.user.email, { title: "Claim submitted", message: `Your claim for ${item.title} is pending staff review.`, type: "claim", itemId: item.registryId, claimId: String(claim._id || claim.id) });
  for (const email of rolesFromEnv("STAFF_EMAILS")) await addNotification(email, { title: "Claim needs review", message: `A new claim was submitted for ${item.title}.`, type: "claim", itemId: item.registryId, claimId: String(claim._id || claim.id) });
  res.status(201).json({ claim });
}));
app.get("/api/claims/:id", requireAuth, asyncRoute(async (req, res) => { const claim = mongoConfigured ? await Claim.findById(req.params.id).lean() : memory.claims.find((record) => record.id === req.params.id || record._id === req.params.id); if (!claim) return fail(res, "Claim was not found.", 404); if (claim.email !== req.user.email && !["staff", "admin"].includes(req.user.role)) return fail(res, "You cannot view this claim.", 403); res.json({ claim }); }));

app.post("/api/auth/request-otp", (req, res) => {
  const email = clean(req.body?.email, 254).toLowerCase(); if (!validEmail(email)) return fail(res, "Use a valid @rvu.edu.in email address.");
  const now = Date.now(), previous = otpAttempts.get(email) || [];
  const recent = previous.filter((time) => now - time < 15 * 60 * 1000); if (recent.length >= 5) return fail(res, "Too many code requests. Try again in 15 minutes.", 429);
  recent.push(now); otpAttempts.set(email, recent);
  if (process.env.NODE_ENV === "production") return fail(res, "Email delivery is not configured. Contact the portal administrator.", 503);
  const otp = process.env.DEV_OTP || String(crypto.randomInt(100000, 1000000)); otpStore.set(email, { otp, expires: now + 5 * 60 * 1000 });
  res.json({ message: "Development OTP generated. Configure email delivery before production.", ...(process.env.NODE_ENV !== "production" ? { developmentOtp: otp } : {}) });
});
app.post("/api/auth/login", asyncRoute(async (req, res) => {
  const fullName = clean(req.body?.fullName, 100), email = clean(req.body?.email, 254).toLowerCase(), phone = clean(req.body?.phone, 30), otp = String(req.body?.otp || "");
  if (!validEmail(email)) return fail(res, "Use a valid @rvu.edu.in email address.");
  if (!fullName) return fail(res, "Full name is required.");
  if (phone && !/^\d{10}$/.test(phone.replace(/\s/g, ""))) return fail(res, "Phone must contain 10 digits.");
  if (req.body?.agreed !== true) return fail(res, "You must agree to campus policies.");
  const now = Date.now(), previousAttempts = (loginAttempts.get(email) || []).filter((time) => now - time < 15 * 60 * 1000);
  if (previousAttempts.length >= 8) return fail(res, "Too many login attempts. Request a new code later.", 429);
  const saved = otpStore.get(email);
  if (!saved || saved.expires < now || saved.otp !== otp) { previousAttempts.push(now); loginAttempts.set(email, previousAttempts); return fail(res, "OTP is invalid or expired.", 401); }
  otpStore.delete(email); loginAttempts.delete(email);
  const adminEmails = rolesFromEnv("ADMIN_EMAILS"), staffEmails = rolesFromEnv("STAFF_EMAILS");
  const role = adminEmails.includes(email) ? "admin" : staffEmails.includes(email) ? "staff" : "student";
  const values = { fullName, email, phone, role };
  const user = mongoConfigured ? await User.findOneAndUpdate({ email }, { $set: values, $setOnInsert: { program: "RV University student" } }, { upsert: true, new: true, runValidators: true }).lean() : (() => { let record = memory.users.find((entry) => entry.email === email); if (!record) { record = { _id: crypto.randomUUID(), ...values }; memory.users.push(record); } else Object.assign(record, values); return record; })();
  res.json({ user, token: signToken(user) });
}));
app.get("/api/profile", requireAuth, asyncRoute(async (req, res) => { const user = mongoConfigured ? await User.findOne({ email: req.user.email }).lean() : memory.users.find((record) => record.email === req.user.email); user ? res.json({ user }) : fail(res, "User was not found.", 404); }));
app.put("/api/profile", requireAuth, asyncRoute(async (req, res) => {
  const fullName = clean(req.body?.fullName, 100), program = clean(req.body?.program, 120), phone = clean(req.body?.phone, 30);
  if (!fullName) return fail(res, "Full name is required."); if (phone && !/^\d{10}$/.test(phone.replace(/\s/g, ""))) return fail(res, "Phone must contain 10 digits.");
  const user = mongoConfigured ? await User.findOneAndUpdate({ email: req.user.email }, { $set: { fullName, program, phone } }, { new: true, runValidators: true }).lean() : memory.users.find((record) => record.email === req.user.email);
  if (user && !mongoConfigured) Object.assign(user, { fullName, program, phone });
  user ? res.json({ user }) : fail(res, "User was not found. Sign in again.", 404);
}));
app.get("/api/profile/activity", requireAuth, asyncRoute(async (req, res) => {
  if (!mongoConfigured) return res.json({ itemsReported: memory.items.filter((item) => item.reportedByEmail === req.user.email).length, claims: memory.claims.filter((claim) => claim.email === req.user.email).length, unreadNotifications: memory.notifications.filter((entry) => entry.userEmail === req.user.email && !entry.read && !entry.dismissed).length });
  const [itemsReported, claims, unreadNotifications] = await Promise.all([Item.countDocuments({ reportedByEmail: req.user.email }), Claim.countDocuments({ email: req.user.email }), Notification.countDocuments({ userEmail: req.user.email, read: false, dismissed: false })]);
  res.json({ itemsReported, claims, unreadNotifications });
}));
app.get("/api/notifications", requireAuth, asyncRoute(async (req, res) => { const notifications = mongoConfigured ? await Notification.find({ userEmail: req.user.email, dismissed: false }).sort({ createdAt: -1 }).limit(100).lean() : memory.notifications.filter((entry) => entry.userEmail === req.user.email && !entry.dismissed).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); res.json({ notifications, count: notifications.length }); }));
app.patch("/api/notifications/read-all", requireAuth, asyncRoute(async (req, res) => { if (mongoConfigured) await Notification.updateMany({ userEmail: req.user.email, dismissed: false }, { $set: { read: true } }); else memory.notifications.filter((entry) => entry.userEmail === req.user.email).forEach((entry) => { entry.read = true; }); res.json({ message: "All notifications marked as read." }); }));
app.patch("/api/notifications/:id", requireAuth, asyncRoute(async (req, res) => { const notification = mongoConfigured ? await Notification.findOneAndUpdate({ _id: req.params.id, userEmail: req.user.email }, { $set: { read: Boolean(req.body?.read) } }, { new: true }).lean() : memory.notifications.find((entry) => entry._id === req.params.id && entry.userEmail === req.user.email); if (notification && !mongoConfigured) notification.read = Boolean(req.body?.read); notification ? res.json({ notification }) : fail(res, "Notification was not found.", 404); }));
app.delete("/api/notifications/:id", requireAuth, asyncRoute(async (req, res) => { const notification = mongoConfigured ? await Notification.findOneAndUpdate({ _id: req.params.id, userEmail: req.user.email }, { $set: { dismissed: true } }, { new: true }).lean() : memory.notifications.find((entry) => entry._id === req.params.id && entry.userEmail === req.user.email); if (notification && !mongoConfigured) notification.dismissed = true; notification ? res.json({ message: "Notification dismissed." }) : fail(res, "Notification was not found.", 404); }));
app.post("/api/support", requireAuth, limitWrites, asyncRoute(async (req, res) => {
  const subject = clean(req.body?.subject, 140), message = clean(req.body?.message, 3000), name = clean(req.body?.name, 100) || "FindHub user";
  if (subject.length < 4) return fail(res, "Subject must be at least 4 characters."); if (message.length < 15) return fail(res, "Please describe the issue in at least 15 characters.");
  const values = { name, email: req.user.email, subject, message, status: "open" };
  const ticket = mongoConfigured ? await SupportTicket.create(values) : { ...values, _id: crypto.randomUUID(), createdAt: new Date() }; if (!mongoConfigured) memory.tickets.push(ticket);
  await addNotification(req.user.email, { title: "Support request received", message: `We received your request: ${subject}.`, type: "support" });
  res.status(201).json({ ticket, message: "Your support request has been received." });
}));
app.get("/api/support", requireAuth, asyncRoute(async (req, res) => { const tickets = mongoConfigured ? await SupportTicket.find({ email: req.user.email }).sort({ createdAt: -1 }).limit(50).lean() : memory.tickets.filter((ticket) => ticket.email === req.user.email); res.json({ tickets }); }));
app.get("/api/admin/support", requireAuth, requireStaff, asyncRoute(async (req, res) => { const tickets = mongoConfigured ? await SupportTicket.find().sort({ createdAt: -1 }).limit(100).lean() : memory.tickets.slice().reverse(); res.json({ tickets }); }));
app.patch("/api/admin/support/:id", requireAuth, requireStaff, limitWrites, asyncRoute(async (req, res) => {
  const status = req.body?.status, response = clean(req.body?.response, 2000);
  if (!["open", "in_progress", "resolved"].includes(status)) return fail(res, "Choose a valid support status.");
  const ticket = mongoConfigured ? await SupportTicket.findByIdAndUpdate(req.params.id, { $set: { status, response } }, { new: true, runValidators: true }).lean() : memory.tickets.find((entry) => entry._id === req.params.id);
  if (!ticket) return fail(res, "Support request was not found.", 404);
  if (!mongoConfigured) Object.assign(ticket, { status, response });
  if (response || status === "resolved") await addNotification(ticket.email, { title: "Support request updated", message: response || `Your support request “${ticket.subject}” was marked resolved.`, type: "support" });
  res.json({ ticket });
}));

app.get("/api/admin/claims", requireAuth, requireStaff, asyncRoute(async (req, res) => { const query = req.query.status ? { status: req.query.status } : {}; const claims = mongoConfigured ? await Claim.find(query).populate({ path: "item", select: "registryId title category location status" }).sort({ createdAt: -1 }).lean() : memory.claims.filter((claim) => !req.query.status || claim.status === req.query.status); res.json({ claims, count: claims.length }); }));
app.patch("/api/admin/claims/:id", requireAuth, requireStaff, limitWrites, asyncRoute(async (req, res) => {
  const status = req.body?.status, reviewNote = clean(req.body?.reviewNote, 1000);
  if (!["approved", "rejected"].includes(status)) return fail(res, "Review status must be approved or rejected.");
  const claim = mongoConfigured ? await Claim.findByIdAndUpdate(req.params.id, { $set: { status, reviewNote, reviewedBy: req.user.email, reviewedAt: new Date() } }, { new: true, runValidators: true }).lean() : memory.claims.find((entry) => entry.id === req.params.id || entry._id === req.params.id);
  if (!claim) return fail(res, "Claim was not found.", 404);
  if (!mongoConfigured) Object.assign(claim, { status, reviewNote, reviewedBy: req.user.email, reviewedAt: new Date() });
  const item = await getItem(claim.itemId);
  if (item) { const remainingClaims = mongoConfigured ? await Claim.countDocuments({ item: item._id, status: "pending" }) : memory.claims.filter((entry) => entry.itemId === claim.itemId && entry.status === "pending").length; const nextStatus = status === "approved" ? "Released" : remainingClaims ? "Claim In Progress" : "In Storage"; if (mongoConfigured) await Item.updateOne({ _id: item._id }, { $set: { status: nextStatus } }); else item.status = nextStatus; }
  await addNotification(claim.email, { title: `Claim ${status}`, message: `Your claim for ${item?.title || claim.itemId} was ${status}.${reviewNote ? ` Staff note: ${reviewNote}` : ""}`, type: "claim", itemId: claim.itemId, claimId: String(claim._id || claim.id) });
  res.json({ claim });
}));
app.get("/api/items/:id/custody", requireAuth, asyncRoute(async (req, res) => { const item = await getItem(req.params.id); if (!item) return fail(res, "Item was not found.", 404); const events = mongoConfigured ? await CustodyEvent.find({ item: item._id }).sort({ createdAt: 1 }).lean() : memory.custody.filter((event) => event.itemId === item.registryId); res.json({ item: publicItem(item), events }); }));
app.post("/api/items/:id/custody", requireAuth, requireStaff, limitWrites, asyncRoute(async (req, res) => {
  const item = await getItem(req.params.id); if (!item) return fail(res, "Item was not found.", 404);
  const event = clean(req.body?.event, 120), location = clean(req.body?.location, 180), locker = clean(req.body?.locker, 80), notes = clean(req.body?.notes, 1000), status = req.body?.status || "In Storage";
  if (!event || !location) return fail(res, "Custody event and location are required.");
  if (!["In Storage", "Claim In Progress", "Released", "Archived"].includes(status)) return fail(res, "Choose a valid item status.");
  const values = { item: item._id, itemId: item.registryId, event, location, locker, status, notes, recordedBy: req.user.email };
  const record = mongoConfigured ? await CustodyEvent.create(values) : { ...values, _id: crypto.randomUUID(), createdAt: new Date() }; if (!mongoConfigured) memory.custody.push(record);
  if (mongoConfigured) await Item.updateOne({ _id: item._id }, { $set: { location, status } }); else Object.assign(item, { location, status });
  await addNotification(item.reportedByEmail, { title: "Custody record updated", message: `${item.title}: ${event} at ${location}.`, type: "custody", itemId: item.registryId });
  res.status(201).json({ event: record });
}));

app.use((err, _req, res, _next) => {
  console.error(err);
  if (err.type === "entity.too.large") return fail(res, "Request is too large. Reduce image size and try again.", 413);
  if (err.name === "ValidationError" || err.name === "CastError") return fail(res, err.message, 400);
  if (err.code === 11000) return fail(res, "That registry record already exists. Please retry.", 409);
  res.status(500).json({ error: "The server encountered an unexpected error." });
});

if (mongoConfigured) mongoose.connect(mongoUri).then(async () => {
  if (await Item.estimatedDocumentCount() === 0) await Item.insertMany(seeds);
  app.listen(port, () => console.log(`FindHub API listening on ${port} (MongoDB)`));
}).catch((error) => { console.error("MongoDB connection failed:", error.message); process.exit(1); });
else app.listen(port, () => console.log(`FindHub API listening on ${port} (memory demo mode; set MONGODB_URI to persist data)`));
