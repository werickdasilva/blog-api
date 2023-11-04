declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;
      JWT_SECRET: string;
      JWT_EXPIRES_IN: string;
    }
  }
}

export {};
