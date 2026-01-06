import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { json } from 'express';
import { App } from './app/App';
import { typeDefs } from './graphql/typeDefs';
import { resolvers } from './graphql/resolvers';
import { domainRestriction } from './middleware/domainRestriction';

const PORT = 3000;

async function bootstrap(): Promise<void> {
    // Get the singleton App instance
    const appInstance = App.getInstance();
    const expressApp = appInstance.app;

    // Create Apollo Server
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
    });

    // Start Apollo Server
    await apolloServer.start();

    // Apply Apollo middleware to Express with domain restriction
    expressApp.use(
        '/graphql',
        json(),
        domainRestriction,
        expressMiddleware(apolloServer)
    );

    // Start the server
    appInstance.listen(PORT);
}

bootstrap().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});
