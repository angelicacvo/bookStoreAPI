import express from 'express';
import 'dotenv/config' 
import cors from "cors";
import { router } from './routes/router.ts'
import 'dotenv/config'
import { authRouter } from "./routes/auth.router.ts";

const PORT = process.env.PORT; 
const app = express() //inicializa express

app.use(cors())
 //convierte la respuesta en un archivo json
app.use(express.json())
// anejar datos codificados en URL
app.use(express.urlencoded({ extended: true }))

router.use("/auth", authRouter); //ejecutar estáticamente auth
app.use(router) //ejecuta la ruta de libros

// permitir el puerto http://localhost:5173 (desde el frontend)
app.use(cors({
    origin: "http://localhost:5173"
}))

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

