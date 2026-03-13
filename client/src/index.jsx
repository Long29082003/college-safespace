import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createRoot } from "react-dom/client";

import { Home } from "./routes/home/Home.jsx";
import { AuthLayout } from "./routes/layout/Layout.jsx";


createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <Routes>
            <Route path = "/" element = {<Home />} />
            <Route path = "/*" element = {<AuthLayout />}>
            </Route>
        </Routes>
    </BrowserRouter>
)