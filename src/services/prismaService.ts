import { PrismaClient } from '@prisma/client';

/**
 * Prisma client singleton for database access
 */
class PrismaService {
    private static instance: PrismaService;
    private readonly _client: PrismaClient;

    private constructor() {
        this._client = new PrismaClient();
    }

    public static getInstance(): PrismaService {
        if (!PrismaService.instance) {
            PrismaService.instance = new PrismaService();
        }
        return PrismaService.instance;
    }

    public get client(): PrismaClient {
        return this._client;
    }
}

export const prisma = PrismaService.getInstance().client;
