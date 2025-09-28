import type { Request, Response, NextFunction} from "express"

// Next es un arg que se encarga de decidir si se continúa de función o no
export const userRoleMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if(req.body.role == "admin"){
        next()
    }
    res.json({"error": "no" })
}


