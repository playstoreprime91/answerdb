const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

const DB_FILE = path.join(__dirname, "database.db");
const db = new sqlite3.Database(DB_FILE, (err) => {
  if (err) console.error("DB open error:", err);
});

// Tworzenie tabeli jeśli nie istnieje
db.run(`CREATE TABLE IF NOT EXISTS produkty (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nazwa TEXT NOT NULL,
  sku TEXT NOT NULL,
  cena REAL,
  kategoria TEXT,
  stan_magazynu INTEGER
)`);

// GET ALL
app.get("/produkty", (req, res) => {
  db.all("SELECT * FROM produkty ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET by ID
app.get("/produkty/:id", (req, res) => {
  db.get("SELECT * FROM produkty WHERE id=?", [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Produkt nie znaleziony" });
    res.json(row);
  });
});

// CREATE
app.post("/produkty", (req, res) => {
  const { nazwa, sku, cena, kategoria, stan_magazynu } = req.body;
  if (!nazwa || !sku) return res.status(400).json({ error: "nazwa i sku są wymagane" });

  db.run(
    "INSERT INTO produkty (nazwa, sku, cena, kategoria, stan_magazynu) VALUES (?,?,?,?,?)",
    [nazwa, sku, cena || 0, kategoria || "", stan_magazynu || 0],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, nazwa, sku, cena, kategoria, stan_magazynu });
    }
  );
});

// UPDATE
app.put("/produkty/:id", (req, res) => {
  const { nazwa, sku, cena, kategoria, stan_magazynu } = req.body;
  db.run(
    "UPDATE produkty SET nazwa=?, sku=?, cena=?, kategoria=?, stan_magazynu=? WHERE id=?",
    [nazwa, sku, cena, kategoria, stan_magazynu, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: "Produkt nie znaleziony" });
      res.json({ status: "updated" });
    }
  );
});

// DELETE
app.delete("/produkty/:id", (req, res) => {
  db.run("DELETE FROM produkty WHERE id=?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "Produkt nie znaleziony" });
    res.status(204).end();
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
