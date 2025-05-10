import express from "express";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

import userRoutes from "./routes/user.routes.js"; 
import providerRoutes from './routes/provider.routes.js'; 
import customerRoutes from './routes/customer.routes.js'; 
import bookingRoutes from './routes/booking.routes.js';
import categoryRoutes from './routes/category.routes.js';
import connectDB from "./db/connection.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT;

connectDB(); // Connection

app.use(express.json());
app.use(cors());

// NEW CODE
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const onlineUsers = new Map();
io.on("connection", (socket) => {
  // console.log("Socket connected:", socket.id);

  socket.on("register", (userId) => {
    onlineUsers.set(userId, socket.id);
    // console.log(`User ${userId} registered with socket ${socket.id}`);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  });
});


app.use("/user", userRoutes);
app.use("/provider", providerRoutes);
app.use("/customer", customerRoutes);
app.use("/booking", bookingRoutes);
app.use("/category", categoryRoutes);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


export { io, onlineUsers };