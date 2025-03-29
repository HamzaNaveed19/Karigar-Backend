import express from "express"; // express to create the server.
import dotenv from "dotenv"; // dotenv to manage environment variables
import providerRoutes from './routes/provider.routes.js'; // Importing the provider routes
import connectDB from "./db/connection.js"; // Importing the database connection

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT;

connectDB(); // Connect to the database

app.use(express.json());
app.use("/provider", providerRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});