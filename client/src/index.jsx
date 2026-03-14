import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createRoot } from "react-dom/client";

import { Home } from "./routes/home/Home.jsx";
import { AuthLayout } from "./routes/layout/Layout.jsx";
import { Login } from "./routes/login/Login.jsx";
import { Register } from "./routes/register/Register.jsx";


createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <Routes>
            <Route path = "/" element = {<Home />} />
            <Route path = "" element = {<AuthLayout />}>
                <Route path = "/login" element = {<Login />}></Route>
                <Route path = "/register" element = {<Register />}></Route>
            </Route>
        </Routes>
    </BrowserRouter>
)