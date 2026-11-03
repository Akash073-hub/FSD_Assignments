"""Persistent Flask API for FindHub's item directory and ownership claims."""

from datetime import date
import os
import sqlite3
from pathlib import Path
from uuid import uuid4

from flask import Flask, g, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
app.config["DATABASE"] = os.environ.get(
    "FINDHUB_DATABASE", str(Path(__file__).with_name("findhub.sqlite3"))
)
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000"]}})

SEED_ITEMS = [
    ("REG-8492", "Apple AirPods Pro (2nd Gen)", "Electronics", "Main Library Wing (Floor 3)", "White", "2024-10-24", "Case engraved with initials 'MR'. White MagSafe case in mint condition.", "In Storage"),
    ("REG-8493", "Black Leather Bifold Wallet", "IDs & Wallets", "Dining Commons West", "Black", "2024-10-23", "Contains student ID and transit pass. Bellroy brand, textured grain leather.", "In Storage"),
    ("REG-8494", "Calculus: Early Transcendentals (9th Ed)", "Books & Stationery", "Science Complex Room 204", "Blue", "2024-10-22", "Hardcover with blue ribbon bookmark and marginal study notes.", "In Storage"),
    ("REG-8495", "Dell XPS 15 Charger (130W USB-C)", "Electronics", "Engineering Lab B", "Black", "2024-10-24", "Black braided cable with white identification tag. Official OEM Dell adapter.", "In Storage"),
    ("REG-8496", "Hydro Flask 32oz Wide Mouth (Cobalt Blue)", "Accessories", "Sports Center Gym", "Cobalt Blue", "2024-10-21", "Has silver university crest sticker and rubberized boot on base. Flex cap strap intact.", "Claim In Progress"),
    ("REG-8497", "JBL Tune 510BT Wireless Headphones", "Electronics", "Student Union Lounge", "Matte Black", "2024-10-20", "Matte black finish, minimal wear. Foldable on-ear form factor, serial ends in 901.", "In Storage"),
    ("REG-8498", "Keys on Red RVU Lanyard", "Keys & Wallets", "North Campus Gate 2", "Red", "2024-10-24", "Three brass keys with black automotive key fob and mini flashlight carabiner.", "In Storage"),
    ("REG-8499", "North Face Borealis Backpack (Navy)", "Bags & Apparel", "Transit Pavilion", "Navy", "2024-10-19", "Left on bench near shuttle stop. Contains course binders and spiral notebooks.", "In Storage"),
]


def get_db():
    if "db" not in g:
        g.db = sqlite3.connect(app.config["DATABASE"])
        g.db.row_factory = sqlite3.Row
        g.db.execute("PRAGMA foreign_keys = ON")
    return g.db


@app.teardown_appcontext
def close_db(_error=None):
    db = g.pop("db", None)
    if db is not None:
        db.close()


def initialize_database():
    db = sqlite3.connect(app.config["DATABASE"])
    db.execute("PRAGMA foreign_keys = ON")
    db.executescript(
        """
        CREATE TABLE IF NOT EXISTS items (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            category TEXT NOT NULL,
            location TEXT NOT NULL,
            color TEXT NOT NULL,
            date TEXT NOT NULL,
            description TEXT NOT NULL DEFAULT '',
            status TEXT NOT NULL DEFAULT 'In Storage',
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS claims (
            id TEXT PRIMARY KEY,
            item_id TEXT NOT NULL REFERENCES items(id),
            role TEXT NOT NULL,
            email TEXT NOT NULL,
            narrative TEXT NOT NULL,
            usn TEXT NOT NULL DEFAULT '',
            phone TEXT NOT NULL,
            alt_contact TEXT NOT NULL DEFAULT '',
            status TEXT NOT NULL DEFAULT 'pending',
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_items_category ON items(category);
        CREATE INDEX IF NOT EXISTS idx_items_location ON items(location);
        CREATE INDEX IF NOT EXISTS idx_claims_item_id ON claims(item_id);
        """
    )
    count = db.execute("SELECT COUNT(*) FROM items").fetchone()[0]
    if count == 0:
        db.executemany(
            "INSERT INTO items (id,title,category,location,color,date,description,status) VALUES (?,?,?,?,?,?,?,?)",
            SEED_ITEMS,
        )
    db.commit()
    db.close()


def row_to_item(row):
    item = dict(row)
    item["registryId"] = item["id"]
    return item


def error(message, status, fields=None):
    payload = {"error": message}
    if fields:
        payload["fields"] = fields
    return jsonify(payload), status


def validate_object(required_fields):
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return None, error("Request body must be a JSON object.", 400)
    missing = [
        field for field in required_fields
        if not isinstance(data.get(field), str) or not data[field].strip()
    ]
    if missing:
        return None, error("Required fields are missing.", 400, missing)
    return data, None


@app.get("/api/health")
def health():
    return jsonify({"status": "ok", "storage": "sqlite"})


@app.get("/api/items")
def list_items():
    query = request.args.get("q", "").strip().lower()
    category = request.args.get("category", "").strip().lower()
    location = request.args.get("location", "").strip().lower()
    date_window = request.args.get("dateWindow", "").strip().lower()
    clauses, values = [], []
    if query:
        clauses.append("lower(id || ' ' || title || ' ' || description || ' ' || category || ' ' || location || ' ' || color) LIKE ?")
        values.append(f"%{query}%")
    if category and category not in ("all categories", "all"):
        clauses.append("lower(category) LIKE ?")
        values.append(f"%{category}%")
    if location and location not in ("everywhere", "all"):
        clauses.append("lower(location) LIKE ?")
        values.append(f"%{location}%")
    if date_window and date_window != "all time":
        # Dates are ISO-formatted, so the browser can apply rolling windows safely.
        clauses.append("date >= ?")
        from datetime import timedelta
        days = 1 if date_window == "past 24 hours" else 7 if date_window == "past 7 days" else 30
        values.append((date.today() - timedelta(days=days)).isoformat())
    sql = "SELECT * FROM items"
    if clauses:
        sql += " WHERE " + " AND ".join(clauses)
    sql += " ORDER BY date DESC, created_at DESC"
    rows = get_db().execute(sql, values).fetchall()
    results = [row_to_item(row) for row in rows]
    return jsonify({"items": results, "count": len(results)})


@app.get("/api/items/<item_id>")
def get_item(item_id):
    row = get_db().execute("SELECT * FROM items WHERE id = ?", (item_id,)).fetchone()
    if row is None:
        return error("Item was not found.", 404)
    return jsonify({"item": row_to_item(row)})


@app.post("/api/items")
def create_item():
    data, failure = validate_object(("title", "category", "location", "color", "date"))
    if failure:
        return failure
    try:
        date.fromisoformat(data["date"])
    except ValueError:
        return error("date must use YYYY-MM-DD format.", 400)

    db = get_db()
    next_number = db.execute("SELECT MAX(CAST(substr(id, 5) AS INTEGER)) FROM items").fetchone()[0] or 8499
    item = {
        "id": f"REG-{next_number + 1}",
        "title": data["title"].strip(),
        "category": data["category"].strip(),
        "location": data["location"].strip(),
        "color": data["color"].strip(),
        "date": data["date"],
        "description": str(data.get("description", "")).strip(),
        "status": "In Storage",
    }
    item["registryId"] = item["id"]
    db.execute(
        "INSERT INTO items (id,title,category,location,color,date,description,status) VALUES (?,?,?,?,?,?,?,?)",
        tuple(item[field] for field in ("id", "title", "category", "location", "color", "date", "description", "status")),
    )
    db.commit()
    return jsonify({"item": item, "registryId": item["id"]}), 201


@app.get("/api/items/<item_id>/claims")
def list_item_claims(item_id):
    db = get_db()
    if db.execute("SELECT 1 FROM items WHERE id = ?", (item_id,)).fetchone() is None:
        return error("Item was not found.", 404)
    rows = db.execute("SELECT * FROM claims WHERE item_id = ? ORDER BY created_at DESC", (item_id,)).fetchall()
    return jsonify({"claims": [dict(row) for row in rows], "count": len(rows)})


@app.post("/api/items/<item_id>/claims")
def create_claim(item_id):
    data, failure = validate_object(("role", "email", "narrative", "phone"))
    if failure:
        return failure
    db = get_db()
    if db.execute("SELECT 1 FROM items WHERE id = ?", (item_id,)).fetchone() is None:
        return error("The item you are claiming was not found.", 404)
    email = data["email"].strip().lower()
    phone = data["phone"].replace(" ", "")
    if not email.endswith("@rvu.edu.in"):
        return error("Email must use the @rvu.edu.in domain.", 400)
    if data["role"] not in ("owner", "finder"):
        return error("role must be 'owner' or 'finder'.", 400)
    if data.get("agreed") is not True:
        return error("The custody declaration must be accepted.", 400)
    if len(data["narrative"].strip()) < 20:
        return error("narrative must be at least 20 characters.", 400)
    if not phone.isdigit() or len(phone) != 10:
        return error("phone must contain 10 digits.", 400)
    claim = {
        "id": str(uuid4()), "item_id": item_id, "role": data["role"], "email": email,
        "narrative": data["narrative"].strip(), "usn": str(data.get("usn", "")).strip(),
        "phone": data["phone"].strip(), "alt_contact": str(data.get("altContact", "")).strip(),
        "status": "pending",
    }
    db.execute(
        "INSERT INTO claims (id,item_id,role,email,narrative,usn,phone,alt_contact,status) VALUES (?,?,?,?,?,?,?,?,?)",
        tuple(claim[field] for field in ("id", "item_id", "role", "email", "narrative", "usn", "phone", "alt_contact", "status")),
    )
    db.execute("UPDATE items SET status = 'Claim In Progress' WHERE id = ?", (item_id,))
    db.commit()
    return jsonify({"claim": claim}), 201


@app.get("/api/claims/<claim_id>")
def get_claim(claim_id):
    row = get_db().execute("SELECT * FROM claims WHERE id = ?", (claim_id,)).fetchone()
    if row is None:
        return error("Claim was not found.", 404)
    return jsonify({"claim": dict(row)})


initialize_database()

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=int(os.environ.get("PORT", "5000")), debug=True)
