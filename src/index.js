require("dotenv").config();
import app from "./api";

const http = require("http");
const log = require("debug")("log");

const startServer = () => {
  const server = http.createServer(app);
  const normalizePort = (val) => {
    const port = parseInt(val, 10);

    if (Number.isNaN(port)) {
      return val;
    }
    if (port >= 0) {
      return port;
    }

    return false;
  };

  // assign port default 5000
  const port = normalizePort(process.env.PORT || 5000);
  app.set("port", port);

  const errorHandler = (error) => {
    if (error.syscall !== "listen") {
      throw error;
    }
    const address = server.address();
    const bind =
      typeof address === "string" ? `pipe ${address}` : `port: ${port}`;
    switch (error.code) {
      case "EACCES":
        log(`${bind} requires elevated privileges.`);
        process.exit(1);
        break;
      case "EADDRINUSE":
        log(`${bind} is already in use.`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  };

  server.on("error", errorHandler);
  server.on("listening", () => {
    const address = server.address();
    const bind =
      typeof address === "string" ? `pipe ${address}` : `port ${port}`;
    log(`Listening on ${bind}`);
  });

  server.listen(port);

  process.on("SIGINT", () => {
    log("Bye bye!");
    process.exit();
  });
};

try {
  startServer();
} catch (error) {
  // handle errors here
  log(error.message);
  process.exit(-1);
}
