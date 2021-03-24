const express = require("express"),
  dotenv = require("dotenv");

// Route files
const bootcamps = require("./routes/bootcamps");

// Load config file for env vars
dotenv.config({ path: "./config/config.env" });

const { PORT, NODE_ENV } = { ...process.env };
const app = express();

// Mount routers
app.use("/api/v1/bootcamps", bootcamps);

app.get("*", (req, res) => {
  res.status(404).json({ success: false, message: "page not found" });
});

app.listen(PORT, () => {
  console.log(
    `Dev Boot Camp running in ${NODE_ENV} mode on port: ${PORT}`
  );
});
