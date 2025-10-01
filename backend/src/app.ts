// app.ts - Punto de entrada del backend (Express)
// - Configura CORS, body parsers y rutas
// - Expone los módulos /auth y el enrutador dinámico de /src/routes
import express from "express";
import "dotenv/config";
import cors from "cors";
import { router } from "./routes/router.ts";
import { authRouter } from "./routes/auth.router.ts";

const PORT = process.env.PORT;
const app = express();

// Habilita CORS para permitir peticiones desde el frontend (Vite en 5173)
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

// Convierte la respuesta en un archivo json
app.use(express.json());
// Manejar datos codificados en URL
app.use(express.urlencoded({ extended: true }));

// Rutas de autenticación (login, register)
router.use("/auth", authRouter);
// Rutas principales (se cargan dinámicamente en routes/router.ts)
app.use(router);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

