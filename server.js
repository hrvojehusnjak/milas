const express = require("express");
const path = require("path");
const fs = require("fs");
const basicAuth = require("express-basic-auth");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

const adminAuth = basicAuth({
  users: { admin: process.env.ADMIN_PASSWORD },
  challenge: true,
});

app.use(express.json());

app.use(
  "/admin",
  (req, res, next) => {
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
    next();
  },
  adminAuth
);
app.use(
  "/api",
  (req, res, next) => {
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
    next();
  },
  adminAuth
);

const dataPath = path.join(__dirname, "public/data/projects.json");

app.get("/api/projects", (req, res) => {
  res.sendFile(dataPath);
});

app.post("/api/projects", (req, res) => {
  const projects = req.body;

  if (!Array.isArray(projects)) {
    return res.status(400).json({ error: "Invalid format" });
  }

  fs.writeFile(dataPath, JSON.stringify(projects, null, 2), (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to save" });
    }
    res.json({ ok: true });
  });
});

// Serve static files (images, css, js, favicon, etc.)
app.use(express.static(path.join(__dirname, "public")));

// Pretty routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/galerija", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "gallery.html"));
});

app.get("/usluge", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "services.html"));
});

// 404 handler (must be last)
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
