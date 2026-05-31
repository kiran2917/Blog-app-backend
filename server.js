require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");

const app = express();

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);

app.listen(process.env.PORT || 8000, () => {
  console.log("Server running on port", process.env.PORT || 8000);
});