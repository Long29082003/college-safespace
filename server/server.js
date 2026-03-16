import express from "express";
import { submitRoute } from "./routes/submitRoutes.js";
import { getDataRoute } from "./routes/getDataRoutes.js";
import { dashboardRoute } from "./routes/dashboardRoutes.js";
import { authRoute } from "./routes/authRoutes.js";

const app = express();
const PORT = 8000;

app.use(express.json());

app.use("/api/submit", submitRoute);

app.use("/api/get", getDataRoute);

app.use("/api/dashboard", dashboardRoute);

app.use("/api/auth", authRoute);

app.listen(PORT, () => console.log(`Server listens on PORT ${PORT}`));