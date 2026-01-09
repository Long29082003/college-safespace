import express from "express";
import { submitRoute } from "./routes/submitRoutes.js";
import { getDataRoute } from "./routes/getDataRoutes.js";

const app = express();
const PORT = 8000;

app.use(express.json());

app.use("/api/submit", submitRoute);

app.use("/api/get", getDataRoute);

app.listen(PORT, () => console.log(`Server listens on PORT ${PORT}`));