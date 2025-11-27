
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Database
const db = new sqlite3.Database("./students.db");

// Table Create
db.run("CREATE TABLE IF NOT EXISTS students(id INTEGER PRIMARY KEY, name TEXT, age INTEGER)");

// CREATE
app.post("/students", (req, res) => {
  const { name, age } = req.body;
  db.run(`INSERT INTO students(name, age) VALUES(?, ?)`, [name, age], function () {
    res.json({ id: this.lastID, name, age });
  });
});

// READ
app.get("/students", (req, res) => {
  db.all("SELECT * FROM students", [], (err, rows) => {
    res.json(rows);
  });
});

// UPDATE
app.put("/students/:id", (req, res) => {
  const { name, age } = req.body;
  db.run(`UPDATE students SET name=?, age=? WHERE id=?`, [name, age, req.params.id], function () {
    res.json({ updated: this.changes });
  });
});

// DELETE
app.delete("/students/:id", (req, res) => {
  db.run(`DELETE FROM students WHERE id=?`, [req.params.id], function () {
    res.json({ deleted: this.changes });
  });
});

app.listen(5000, () => console.log("Backend running on port 5000"));