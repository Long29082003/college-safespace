import express from "express";
import { submitRoute } from "./routes/submitRoutes.js";

const app = express();
const PORT = 8000;

app.use(express.json());

app.use("/api/submit", submitRoute);

app.listen(PORT, () => console.log(`Server listens on PORT ${PORT}`));