"""Flask API for the FindHub lost-and-found portal.

Storage is intentionally in-memory while the API is being developed. Records
will be lost when the server stops; MongoDB can be added behind these routes
once the API shape is settled.
"""

from datetime import date
from uuid import uuid4

from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

items = []
claims = []


def error(message, status):
    return jsonify({"error": message}), status


@app.get("/api/health")
def health():
    return jsonify({"status": "ok", "storage": "in-memory"})


@app.get("/api/items")
def list_items():
    query = request.args.get("q", "").strip().lower()
    category = request.args.get("category", "").strip().lower()
    location = request.args.get("location", "").strip().lower()
    results = [item for item in items if
               query in " ".join(str(item.get(k, "")) for k in ("title", "description", "category")).lower()
               and (not category or category in item["category"].lower())
               and (not location or location in item["location"].lower())]
    return jsonify({"items": results, "count": len(results)})


@app.post("/api/items")
def create_item():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return error("Request body must be a JSON object.", 400)

    required = ("title", "category", "location", "color", "date")
    missing = [field for field in required if not isinstance(data.get(field), str) or not data[field].strip()]
    if missing:
        return jsonify({"error": "Required fields are missing.", "fields": missing}), 400
    try:
        date.fromisoformat(data["date"])
    except ValueError:
        return error("date must use YYYY-MM-DD format.", 400)

    item = {
        "id": str(uuid4()),
        "registryId": f"FH-{len(items) + 1001}",
        "title": data["title"].strip(),
        "category": data["category"].strip(),
        "location": data["location"].strip(),
        "color": data["color"].strip(),
        "date": data["date"],
        "description": str(data.get("description", "")).strip(),
        "status": "in_storage",
    }
    items.append(item)
    return jsonify({"item": item}), 201


@app.post("/api/items/<item_id>/claims")
def create_claim(item_id):
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return error("Request body must be a JSON object.", 400)
    required = ("role", "email", "narrative", "phone")
    missing = [field for field in required if not isinstance(data.get(field), str) or not data[field].strip()]
    if missing:
        return jsonify({"error": "Required fields are missing.", "fields": missing}), 400
    if not data["email"].strip().lower().endswith("@rvu.edu.in"):
        return error("Email must use the @rvu.edu.in domain.", 400)
    if data["role"] not in ("owner", "finder"):
        return error("role must be 'owner' or 'finder'.", 400)
    if data.get("agreed") is not True:
        return error("The custody declaration must be accepted.", 400)
    if len(data["narrative"].strip()) < 20:
        return error("narrative must be at least 20 characters.", 400)
    if not data["phone"].replace(" ", "").isdigit() or len(data["phone"].replace(" ", "")) != 10:
        return error("phone must contain 10 digits.", 400)

    claim = {
        "id": str(uuid4()), "itemId": item_id, "role": data["role"],
        "email": data["email"].strip().lower(), "narrative": data["narrative"].strip(),
        "usn": str(data.get("usn", "")).strip(), "phone": data["phone"].strip(),
        "altContact": str(data.get("altContact", "")).strip(), "agreed": True, "status": "pending",
    }
    claims.append(claim)
    return jsonify({"claim": claim}), 201


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
