import { userService, User } from '../services/userService';

interface UserArgs {
    id: string;
}

export const resolvers = {
    Query: {
        /**
         * Resolver for user query
         * @param _ - Parent object (unused)
         * @param args - Query arguments containing the user ID
         * @returns The user if found, null otherwise
         */
        user: async (_: unknown, args: UserArgs): Promise<User | null> => {
            const { id } = args;

            if (!id || typeof id !== 'string' || id.trim().length === 0) {
                throw new Error('Invalid user ID provided');
            }

            return userService.findById(id);
        },
    },
};
