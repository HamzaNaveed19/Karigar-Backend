import express from "express"; // express to create the server.
import dotenv from "dotenv"; // dotenv to manage environment variables
import http from "http"; // Required for socket server
import { Server } from "socket.io"; // Socket.IO server




import userRoutes from "./routes/user.routes.js"; // Importing the user routes
import providerRoutes from './routes/provider.routes.js'; // Importing the provider routes
import customerRoutes from './routes/customer.routes.js'; // Importing the customer routes
import bookingRoutes from './routes/booking.routes.js'; // Importing the booking routes
import categoryRoutes from './routes/category.routes.js'; // Importing the category routes
import connectDB from "./db/connection.js"; // Importing the database connection
import cors from "cors"; // Importing CORS middleware

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT;


// NEW CODE
// Create HTTP server and Socket.IO instance
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Update to frontend URL in production
    methods: ["GET", "POST"],
  },
});

const onlineUsers = new Map();
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("register", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`User ${userId} registered with socket ${socket.id}`);
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

// OLD CODE
connectDB(); // Connect to the database

app.use(express.json());
app.use(cors());
app.use("/user", userRoutes);
app.use("/provider", providerRoutes);
app.use("/customer", customerRoutes);
app.use("/booking", bookingRoutes);
app.use("/category", categoryRoutes);

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// New CODE
// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export for controllers
export { io, onlineUsers };