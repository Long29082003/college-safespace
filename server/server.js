import express from "express";
import { submitRoute } from "./routes/submitRoutes.js";
import { getDataRoute } from "./routes/getDataRoutes.js";
import { dashboardRoute } from "./routes/dashboardRoutes.js";
import { authRoute } from "./routes/authRoutes.js";
import { authorizationRoute } from "./routes/authorizationRoutes.js";

import cors from "cors";
import cookieParser from "cookie-parser";
import { corsOption, credential } from "./hooks/cors.js";

const app = express();
const PORT = 8000;

app.use(cookieParser());

app.use(credential);

app.use(express.json());

app.use(cors(corsOption));

app.use("/api/submit", submitRoute);

app.use("/api/get", getDataRoute);

app.use("/api/dashboard", dashboardRoute);

app.use("/api/auth", authRoute);

app.use("/api/authorization", authorizationRoute);

app.listen(PORT, () => console.log(`Server listens on PORT ${PORT}`));