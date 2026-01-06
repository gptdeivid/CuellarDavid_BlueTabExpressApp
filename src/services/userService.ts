import { prisma } from './prismaService';

export interface User {
    id: string;
    name: string;
}

/**
 * User service for database operations
 */
export class UserService {
    /**
     * Find a user by ID
     * @param id - The user ID to search for
     * @returns The user if found, null otherwise
     */
    async findById(id: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { id },
        });
    }

    /**
     * Get all users
     * @returns Array of all users
     */
    async findAll(): Promise<User[]> {
        return prisma.user.findMany();
    }
}

export const userService = new UserService();
