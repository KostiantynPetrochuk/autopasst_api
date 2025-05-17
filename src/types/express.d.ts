// src/types/express.d.ts
import { User } from '../user/user.entity';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        // other fields
      };
    }
  }
}
