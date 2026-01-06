import { Router, Request, Response, NextFunction } from 'express';
import { userService } from '../services/userService';
import { ApiError } from '../middleware/errorHandler';

const router = Router();

/**
 * Validate user ID parameter
 */
function validateUserId(req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params;

    if (!id || typeof id !== 'string' || id.trim().length === 0) {
        next(new ApiError(400, 'Invalid user ID provided'));
        return;
    }

    next();
}

/**
 * GET /users/:id
 * Returns a user by ID
 */
router.get('/:id', validateUserId, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const user = await userService.findById(id);

        if (!user) {
            res.status(404).json({
                error: 'Not Found',
                message: `User with ID '${id}' not found`,
            });
            return;
        }

        res.json(user);
    } catch (error) {
        next(error);
    }
});

export default router;
