const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const http = require("http");
const cors = require("cors");
const app = express();
const httpServer = http.createServer(app);
const { initiateSocket } = require("./socketIo/initiateSocket");

dotenv.config({ path: "./config.env" });

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

initiateSocket(httpServer);

httpServer.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});
