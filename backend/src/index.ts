import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";

import authRoutes from "./routes/auth.routes";
import courseRoutes from "./routes/course.routes";
import enrollmentRoutes from "./routes/enrollment.routes";
import progressRoutes from "./routes/progress.routes";
import certificateRoutes from "./routes/certificate.routes";
import resourceRoutes from "./routes/resource.routes";
import adminRoutes from "./routes/admin.routes";
import errorHandler from "./middleware/errorHandler";

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", courseRoutes);
app.use("/api", enrollmentRoutes);
app.use("/api", progressRoutes);
app.use("/api", certificateRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/admin", adminRoutes);

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
