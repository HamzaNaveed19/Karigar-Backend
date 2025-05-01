import express from "express"; // express to create the server.
import dotenv from "dotenv"; // dotenv to manage environment variables
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

connectDB(); // Connect to the database

app.use(express.json());
app.use(cors());
app.use("/user", userRoutes);
app.use("/provider", providerRoutes);
app.use("/customer", customerRoutes);
app.use("/booking", bookingRoutes);
app.use("/category", categoryRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});