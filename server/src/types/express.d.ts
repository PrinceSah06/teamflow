// types/express.d.ts or similar
import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
  };
}
