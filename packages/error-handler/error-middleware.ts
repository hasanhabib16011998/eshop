export const errorMiddleWare = (err: Error, req: Request, res: Response) => {
    if(err instanceof AppError)
}