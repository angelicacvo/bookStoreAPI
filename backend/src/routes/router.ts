import { Router, type Request, type Response } from "express";
import { readdirSync } from "fs";
import * as z from "zod";
import { fileURLToPath } from "url";
import { dirname } from "path";

export const __filename = fileURLToPath(import.meta.url)
export const __dirname = dirname(__filename)

const router = Router()
const PATH = (`${__dirname}`)

// quitarle el .ts
const cleanFileName = (fileName: string) => {
    const file = fileName.split('.').shift()
    return file
}

// escanear los archivos que hay dentro de la ruta routes
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

// EJEMPLO ZOD
// // para no hacer la validación en el tiempo de ejecución de usa zod:
// const bookSchema = z.object({
//     title: z.string(),
//     name: z.string(),
//     year: z.string()
// })

// // a partir de esto se puede crear un objeto 
// type Book = z.infer<typeof bookSchema>
// router.post("/", req: Request, res: Response) => {
//     const parseResult = bookSchema.safeParse(require.body)
//     if(!parseResult.success){

//     }
//     const book: Book = parseResult.data

// } 




export { router }
