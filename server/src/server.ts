import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import authRoutes from "./routes/authRoutes";
import applicationRoutes from "./routes/applicationRoutes";
import healthRoutes from "./routes/healthRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = [process.env.FRONTEND_URL, process.env.CLIENT_URL].filter(Boolean) as string[];

// Middleware runs before routes. JSON parsing lets Express read request bodies.
app.use(
  cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : true
  })
);
app.use(express.json());

// API routes are grouped by feature to keep the server entry file small.
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
