import express from "express";
import https from "https";
import http from "http";
import fs from "fs";
import path from "path";
import cors from "cors";
import { execSync } from "child_process";
import os from "os";
import connectDB from "@/lib/mongoose.js";
import "dotenv/config";
import cookieParser from "cookie-parser";
import route from "@/routes/route";
import isDev from "@/helper/isDev";
import env from "@/helper/envResolver";
import { Server as SocketIOServer } from "socket.io";

const PORT = isDev() ? env("DEV_SERVER_PORT") : env("PROD_SERVER_PORT");
const DOMAIN = isDev() ? env("DEV_SERVER_DOMAIN") : env("PROD_SERVER_DOMAIN");
const PROTOCOL = isDev()
  ? env("DEV_SERVER_PROTOCOL")
  : env("PROD_SERVER_PROTOCOL");
const CERT_DIR = path.resolve("./cert");
const KEY_PATH = path.join(CERT_DIR, "key.pem");
const CERT_PATH = path.join(CERT_DIR, "cert.pem");

const corsOptions = {
  origin: [`${PROTOCOL}://${DOMAIN}${PORT && `:${PORT}`}`],
  credentials: true,
};

const app = express();
let io = null;

if (env("USE_SOCKET_IO") === "true") {
  app.use((req, res, next) => {
    req.io = io;
    next();
  });
}

if (env("USE_MONGO") === "true") {
  console.log("🔗 Connecting to MongoDB...");
  connectDB();
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(route);

app.get("/", (req, res) => {
  res.send("Welcome to API!");
});

function ensureCertificate() {
  if (fs.existsSync(KEY_PATH) && fs.existsSync(CERT_PATH)) return;

  console.log(
    "🔒 No SSL certificate found. Generating self-signed certificate..."
  );

  if (!fs.existsSync(CERT_DIR)) fs.mkdirSync(CERT_DIR);

  try {
    execSync(
      `openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout "${KEY_PATH}" -out "${CERT_PATH}" -subj "/CN=localhost"`,
      { stdio: "ignore" }
    );
    console.log("✅ SSL certificate generated.");
  } catch (err) {
    console.error("❌ Failed to generate certificate:", err);
    process.exit(1);
  }

  // Instead of reinventing the wheel with string concatenation…
  if (os.platform() === "win32") {
    try {
      // In ensureCertificate(), under win32:
      execSync(`certutil -user -addstore Root "${CERT_PATH}"`, {
        stdio: "ignore",
      });
      console.log("🔐 Certificate trusted in CurrentUser root store.");
    } catch (err) {
      console.warn("⚠️ Failed to trust certificate on Windows:", err);
    }
  } else {
    console.log(
      "📝 Windows not detected, please install certificate manually."
    );
  }
}

function startServer() {
  let server;

  if (PROTOCOL === "https") {
    ensureCertificate();

    const key = fs.readFileSync(KEY_PATH, "utf8");
    const cert = fs.readFileSync(CERT_PATH, "utf8");

    server = https.createServer({ key, cert }, app);
  } else {
    server = http.createServer(app);
  }

  // Socket.IO setup
  if (env("USE_SOCKET_IO") === "true") {
    io = new SocketIOServer(server, {
      cors: corsOptions,
      path: env("SOCKET_IO_PATH"),
    });
  }

  server.listen(PORT, () => {
    console.log(`🚀 Server running on ${PROTOCOL}://${DOMAIN}:${PORT}`);
  });
}

startServer();
export default app;
