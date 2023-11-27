import { Error } from '../validation/types'

export const createHttpError = (status: number, message: string) => {
  const error: Error = new Error()
  error.message = message
  error.status = status
}
