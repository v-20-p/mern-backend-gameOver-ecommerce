export interface Error {
  status?: number
  message?: string
}

export type CategoryType = {
  title: string
  slug?: string
}

export type CategoryInput = Omit<CategoryType, 'title'>

export interface ErrorInterface {
  status?: number
  message?: string
}
