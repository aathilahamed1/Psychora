import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';
export declare const authorize: (allowedRoles: string[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
//# sourceMappingURL=authorize.d.ts.map