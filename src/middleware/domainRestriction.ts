import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to restrict traffic to allowed domains only.
 * Allows requests from:
 * - example.com
 * - localhost:3000
 * 
 * All other domains receive a 403 Forbidden response.
 */
export function domainRestriction(req: Request, res: Response, next: NextFunction): void {
    const host = req.headers.host || '';
    const origin = req.headers.origin || '';
    const referer = req.headers.referer || '';

    // Allowed domains
    const allowedHosts = [
        'example.com',
        'www.example.com',
        'localhost:3000',
        '127.0.0.1:3000',
    ];

    // Check if the host matches any allowed domain
    const isAllowedHost = allowedHosts.some(
        (allowed) => host === allowed || host.endsWith(`.${allowed}`)
    );

    // Check origin header (for CORS requests)
    const isAllowedOrigin = allowedHosts.some(
        (allowed) =>
            origin.includes(allowed) ||
            origin === `http://${allowed}` ||
            origin === `https://${allowed}`
    );

    // Check referer header
    const isAllowedReferer = allowedHosts.some(
        (allowed) =>
            referer.includes(allowed) ||
            referer.startsWith(`http://${allowed}`) ||
            referer.startsWith(`https://${allowed}`)
    );

    if (isAllowedHost || isAllowedOrigin || isAllowedReferer) {
        next();
    } else {
        res.status(403).json({
            error: 'Forbidden',
            message: 'Access denied. This API only accepts traffic from example.com or localhost:3000.',
        });
    }
}
