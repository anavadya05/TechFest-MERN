
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");


const logger = require("./middleware/logger.cjs");
const notFound = require("./middleware/notFound.cjs");
const errorHandler = require("./middleware/errorHandler.cjs");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(helmet());

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173"
}));

app.use(express.json({ limit: "10kb" }));

app.use(logger);

app.use("/api/events", require("./routes/events.cjs"));
app.use("/api/auth", require("./routes/auth.cjs"));
app.use("/api/registrations", require("./routes/registrations.cjs"));

app.use(notFound);
app.use(errorHandler);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Atlas connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
