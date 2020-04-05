
export interface NewsArticle {
  source: NewsArticleSource
  author: string
  title: string
  description: string
  url: string
  urlToImage: string
  publishedAt: Date
  content: string
}

export interface NewsArticleSource {
  id: string
  name: string
}

export interface PasswordObject {
  password: string
  hash: string
}

export interface FilteredTestedList {
  filteredList: NewsArticle[]
  test: boolean
}

export interface RawPassword {
  first: string
  second: string
}

export interface AxiosFetchRequest {
  userTopics: string[]
  db_id: string
}

export interface RegistrationData {
  email: string
  first_password: string
  second_password: string
}

export interface LoginData {
  password: string
  email: string
  last_login: string
}

export type Topic = {
  name: string
}