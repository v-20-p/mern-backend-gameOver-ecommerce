import { ErrorInterface } from "../types"

export const createError = (status: number, message: string) => {
    const error: ErrorInterface = new Error()
    error.status = status
    error.message = message
    return error
}
