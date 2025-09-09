import type { Database } from './middleware/db.middleware';

export type Env = {
  Bindings: {
    DATABASE_URL: string;
    ENVIRONMENT?: string;
    PROJECT_NAME?: string;
    CORS_ORIGINS?: string;
    BASE_URL?: string;
  };
  Variables: {
    db: Database;
  };
};
