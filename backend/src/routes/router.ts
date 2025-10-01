// routes/router.ts - Enrutador dinámico
// Escanea esta carpeta y automáticamente monta cada archivo *.router.ts
// en una ruta con el nombre del archivo. Ej: books.router.ts -> /books
import { Router, type Request, type Response } from "express";
import { readdirSync } from "fs";
import * as z from "zod";
import { fileURLToPath } from "url";
import { dirname } from "path";

export const __filename = fileURLToPath(import.meta.url)
export const __dirname = dirname(__filename)

const router = Router()
const PATH = (`${__dirname}`)

// Quita la extensión .ts para producir el nombre base del módulo
const cleanFileName = (fileName: string) => {
    const file = fileName.split('.').shift()
    return file
}

// Lee todos los archivos de esta carpeta y registra sus routers
readdirSync(PATH).filter((fileName) => {
    const cleanName = cleanFileName(fileName)
    if (cleanName && cleanName !== "router") {
        import(`./${cleanName}.router.ts`).then((moduleRouter) => {
            if (moduleRouter?.router) {
                router.use(`/${cleanName}`, moduleRouter.router)
            }
        })
    }
})

export { router }
