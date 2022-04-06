import app from "./server.js";
import config from "./config/config.js";

const PORT = config.PORT;
app.listen(PORT, () => console.log(`Server listening to port ${PORT}! 👂`));
