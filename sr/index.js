const express = require("express");
const morgan = require("morgan");
const path = require("path");
const mainRoutes = require("./routes/index");
const connectDB = require("./config/db.js");
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const dotenv = require("dotenv");
const cors = require("cors"); // import cors package

// Load environment variables
dotenv.config();
connectDB();

const app = express();

// Middleware
app.use("/components", express.static(path.join(__dirname, "./my-app/components")));

app.use(express.json());
app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/", mainRoutes);
// Route để render file HTML từ thư mục frontend

app.get("app/login", (req, res) => {
  res.sendFile(path.join(__dirname, "./my-app/app/login.tsx"));
});



// Cấu hình CORS
app.use(
  cors({
    origin: "*", // Cho phép tất cả các domain
    methods: "GET,POST,DELETE", // Các phương thức được phép
    allowedHeaders: "Content-Type, Authorization", // Các header được phép
  })
);

// Routes
app.use("/", mainRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
