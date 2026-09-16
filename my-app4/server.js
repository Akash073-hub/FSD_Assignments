const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 3004;

const items = [
  { id: "FH-1042", title: "Black Leather Bifold Wallet", category: "IDs & Wallets", location: "Dining Commons West", date: "Today, 10:24 AM", status: "Verification pending", icon: "wallet", tone: "amber", description: "Bellroy wallet with a student ID and transit pass." },
  { id: "FH-1038", title: "Apple AirPods Pro (2nd Gen)", category: "Electronics", location: "Main Library, Floor 3", date: "Yesterday, 4:10 PM", status: "In secure storage", icon: "headphones", tone: "blue", description: "White MagSafe case with initials engraved on the lid." },
  { id: "FH-1031", title: "North Face Borealis Backpack", category: "Bags & Apparel", location: "Transit Pavilion", date: "Sep 14, 8:42 AM", status: "Ready to claim", icon: "backpack", tone: "green", description: "Navy backpack with course binders and spiral notebooks." },
  { id: "FH-1027", title: "Keys on Red RVU Lanyard", category: "Keys & Wallets", location: "North Campus Gate 2", date: "Sep 13, 6:18 PM", status: "In secure storage", icon: "key", tone: "violet", description: "Three brass keys, an automotive fob, and a mini flashlight." },
  { id: "FH-1022", title: "Calculus: Early Transcendentals", category: "Books & Stationery", location: "Science Complex 204", date: "Sep 12, 1:05 PM", status: "Ready to claim", icon: "book", tone: "rose", description: "Ninth edition hardcover with a blue ribbon bookmark." }
];

const games = [
  { title: "Cyberpunk 2077", genre: "Action RPG", rating: "4.9", art: "cyberpunk", platform: "PC / PS5 / Xbox" },
  { title: "Elden Ring", genre: "Soulslike", rating: "4.8", art: "elden", platform: "PC / PS5 / Xbox" },
  { title: "Hades II", genre: "Roguelike", rating: "4.7", art: "hades", platform: "PC" },
  { title: "Forza Horizon 5", genre: "Racing", rating: "4.6", art: "forza", platform: "PC / Xbox" },
  { title: "Hollow Knight", genre: "Metroidvania", rating: "4.8", art: "hollow", platform: "PC / Switch" }
];

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.locals.formatNumber = (value) => new Intl.NumberFormat("en-IN").format(value);

app.get("/", (req, res) => res.redirect("/home"));

app.get("/home", (req, res) => {
  res.render("home", {
    title: "Game Library",
    games,
    featuredGames: games.slice(0, 3)
  });
});

app.get("/profile", (req, res) => {
  res.render("profile", {
    title: "Akash",
    games,
    profile: { name: "Akash", handle: "@akash", level: 27, xp: 7420, nextLevel: 9000, hours: "186h", completed: 24, backlog: 12, friends: 48 }
  });
});

app.get("/search", (req, res) => {
  const query = String(req.query.q || "").trim().toLowerCase();
  const category = String(req.query.category || "All categories");
  const filteredItems = items.filter((item) => {
    const matchesQuery = !query || [item.title, item.category, item.location, item.description].join(" ").toLowerCase().includes(query);
    const matchesCategory = category === "All categories" || item.category === category;
    return matchesQuery && matchesCategory;
  });
  res.render("search", { title: "Search Registry", items: filteredItems, query: req.query.q || "", category });
});

app.get("/report", (req, res) => {
  res.render("report", { title: "Report an Item", submitted: false });
});

app.post("/report", (req, res) => {
  const title = String(req.body.title || "your item").trim();
  res.render("report", { title: "Report an Item", submitted: true, itemTitle: title });
});

app.post("/claim/:id", (req, res) => {
  const item = items.find((entry) => entry.id === req.params.id);
  if (!item) return res.status(404).render("not-found", { title: "Item not found" });
  res.render("claim", { title: "Claim request received", item });
});

app.use((req, res) => res.status(404).render("not-found", { title: "Page not found" }));

app.listen(port, () => {
  console.log(`FindHub EJS app running at http://localhost:${port}`);
});
