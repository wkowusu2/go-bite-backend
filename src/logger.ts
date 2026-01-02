import { NextFunction, Request, Response } from "express"

export const logger = (req: Request, res: Response, next: NextFunction) => {
    console.log("requst come in with body :", req.body)
    next()
}