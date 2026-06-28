"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const applicationRoutes_1 = __importDefault(require("./routes/applicationRoutes"));
const healthRoutes_1 = __importDefault(require("./routes/healthRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware runs before routes. JSON parsing lets Express read request bodies.
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// API routes are grouped by feature to keep the server entry file small.
app.use("/api/health", healthRoutes_1.default);
app.use("/api/applications", applicationRoutes_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
