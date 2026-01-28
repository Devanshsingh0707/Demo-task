const express = require("express");
const cors = require("cors");
const mfaRoutes = require("./routes/mfa.routes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/mfa", mfaRoutes);

app.listen(5000, () =>
  console.log("Backend running on port 5000")
);
