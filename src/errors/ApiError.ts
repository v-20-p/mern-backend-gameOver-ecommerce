class ApiError {
  constructor(public code: number, public message: string) {
    this.code = code
    this.message = message
  }
  static badRequest(code: number, message: string) {
    return new ApiError(code, message)
  }
  static internal(message: string) {
    return new ApiError(500, message)
  }
}

export default ApiError
