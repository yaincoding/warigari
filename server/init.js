import app from "./server.js";
import config from "./config/config.js";
import db from "./models/index.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`express server is listening on ${PORT}`);
});
