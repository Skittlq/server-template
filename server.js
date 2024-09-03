if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

import express from "express";
import https from "https";
import fs from "fs";
import cors from "cors";
import connectDB from "@/lib/mongoose.js";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { Server as SocketIOServer } from "socket.io";
import route from "@/routes/route";

// Environment variables
const PORT = process.env.NEXT_PUBLIC_COMPUTER_PORT;

const corsOptions = {
  origin: ["https://localhost:3000", "https://localhost:3001"],
  credentials: true,
};

// Initialize Express app
const app = express();

// let io;
let server;

// app.use((req, res, next) => {
//   req.io = io;
//   next();
// });

// Database connection
// connectDB();

// Middleware
app.use(cors(corsOptions)); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser());

// Sample route
app.use(route);

// Sample route
app.get("/", (req, res) => {
  res.send("Welcome to swad-api!");
});

const key = fs.readFileSync("./cert/key.pem", "utf8");
const cert = fs.readFileSync("./cert/cert.pem", "utf8");

const httpsOptions = {
  key: key,
  cert: cert,
};

// Start the server
const startServer = () => {
  server = https.createServer(httpsOptions, app);

  // Socket.IO setup
  // io = new SocketIOServer(server, {
  //   cors: corsOptions,
  // });

  // Start the HTTP/HTTPS server
  server.listen(PORT, () => {
    console.log(
      `Server running on https://${process.env.NEXT_PUBLIC_COMPUTER_DOMAIN}:${PORT}`
    );
  });
};

startServer();

export default app;
