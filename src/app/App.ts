import express, { Express, json } from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { domainRestriction } from '../middleware/domainRestriction';
import { errorHandler } from '../middleware/errorHandler';
import userRoutes from '../routes/userRoutes';

/**
 * Singleton Express Application class.
 * Ensures only one instance of the Express app exists throughout the application lifecycle.
 */
export class App {
    private static instance: App;
    private readonly _app: Express;

    /**
     * Private constructor to prevent direct instantiation.
     * Initializes the Express application with all middleware and routes.
     */
    private constructor() {
        this._app = express();
        this.initializeMiddleware();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }

    /**
     * Returns the singleton instance of the App class.
     * Creates a new instance if one doesn't exist.
     */
    public static getInstance(): App {
        if (!App.instance) {
            App.instance = new App();
        }
        return App.instance;
    }

    /**
     * Readonly accessor for the Express application instance.
     */
    public get app(): Express {
        return this._app;
    }

    /**
     * Initialize middleware pipeline.
     */
    private initializeMiddleware(): void {
        // Parse JSON bodies
        this._app.use(json());

        // Domain restriction middleware - applied to all routes
        this._app.use(domainRestriction);
    }

    /**
     * Initialize application routes.
     */
    private initializeRoutes(): void {
        // Swagger UI documentation
        try {
            const swaggerDocument = YAML.load(path.join(process.cwd(), 'swagger.yaml'));
            this._app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
        } catch (error) {
            console.warn('Swagger documentation not loaded:', error);
        }

        // REST API routes
        this._app.use('/users', userRoutes);

        // Health check endpoint
        this._app.get('/health', (req, res) => {
            res.json({ status: 'healthy', timestamp: new Date().toISOString() });
        });
    }

    /**
     * Initialize error handling middleware.
     */
    private initializeErrorHandling(): void {
        this._app.use(errorHandler);
    }

    /**
     * Start the server on the specified port.
     * @param port - The port number to listen on
     */
    public listen(port: number): void {
        this._app.listen(port, () => {
            console.log(`🚀 Server is running on http://localhost:${port}`);
            console.log(`📚 Swagger docs available at http://localhost:${port}/api-docs`);
            console.log(`🔒 GraphQL endpoint at http://localhost:${port}/graphql`);
        });
    }
}
