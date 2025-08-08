import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import routerAuth from "./src/routes/auth.routes.js";
import routerRegistros from "./src/routes/registros.routes.js";
import routerDiscounts from "./src/routes/discounts.routes.js";
import { authentication } from "./src/middlewares/authentication.middleware.js";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "https://frontend-nippon.vercel.app", // ou use uma variável de ambiente depois
    credentials: true,
  })
);
app.use(helmet());
app.use(cookieParser());
app.use("/auth", routerAuth);
app.use("/registros", authentication, routerRegistros);
app.use("/discounts", authentication, routerDiscounts);

app.listen(3000, () => console.log("Express a todo vapor!"));
