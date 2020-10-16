
declare namespace NodeJS {
  export interface ProcessEnv {
    PERSONAL_API_KEY: string
    DB_HOST: string
    DB_USER: string
    DB_USER_PASSWORD: string
    DB_NAME: string
    
    DB_CONNECTIONSTRING?: string
    
    COOKIE_SESSION: string
    COOKIE_KEYS?: string
    COOKIE_TIME_OUT: string
    SALT_ROUNDS: string
    
    TEST_PASSWORD: string
    TEST_ALTERNATE_PASSWORD: string
    TEST_USER: string
    TEST_WEAK_PASSWORD: string
  }
}
