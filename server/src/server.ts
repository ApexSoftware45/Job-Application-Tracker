import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import applicationRoutes from "./routes/applicationRoutes";
import healthRoutes from "./routes/healthRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware runs before routes. JSON parsing lets Express read request bodies.
app.use(cors());
app.use(express.json());

// API routes are grouped by feature to keep the server entry file small.
app.use("/api/health", healthRoutes);
app.use("/api/applications", applicationRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
