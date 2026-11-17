import type { Express } from "express";
import helmet from "helmet";

export function registerSecurityHeaders(app: Express): void {
  app.disable("x-powered-by");

  app.use(
    helmet({
      contentSecurityPolicy: {
        reportOnly: true,
        // Deliberately omit upgrade-insecure-requests, including on localhost.
        // Unknown analytics/embedding origins must be inventoried before enforcement.
        useDefaults: false,
        directives: {
          defaultSrc: ["'self'"],
          baseUri: ["'self'"],
          objectSrc: ["'none'"],
          scriptSrc: ["'self'"],
          // React/Framer Motion and public/test.html currently use inline styles.
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "https://private-us-east-1.manuscdn.com"],
          mediaSrc: ["'self'", "https://files.manuscdn.com"],
          connectSrc: ["'self'"],
          frameSrc: ["'self'"],
          // This is a candidate, not an enforced ban on external embedding.
          frameAncestors: ["'self'"],
          formAction: ["'self'"],
        },
      },
      // External CDN audio/images/fonts do not establish a COEP-compatible contract.
      crossOriginEmbedderPolicy: false,
      // Do not newly block other sites from consuming our static assets.
      crossOriginResourcePolicy: false,
      // Preserve popup/embedding integrations until their deployment is inventoried.
      crossOriginOpenerPolicy: false,
      originAgentCluster: false,
      // Keep frame-ancestors report-only; X-Frame-Options would enforce separately.
      xFrameOptions: false,
      // HSTS is applied below only to verified secure production requests.
      strictTransportSecurity: false,
      referrerPolicy: { policy: "strict-origin-when-cross-origin" },
      xContentTypeOptions: true,
      xDnsPrefetchControl: { allow: false },
      xDownloadOptions: true,
      xPermittedCrossDomainPolicies: { permittedPolicies: "none" },
      xPoweredBy: true,
      xXssProtection: true,
    })
  );

  const hsts = helmet.strictTransportSecurity({
    maxAge: 86400,
    includeSubDomains: false,
    preload: false,
  });

  app.use((req, res, next) => {
    // NODE_ENV does not prove HTTPS. req.secure requires TLS or an independently
    // configured trusted proxy; do not trust arbitrary X-Forwarded-Proto here.
    // The current HTTP entrypoint needs its TLS-terminating edge to emit HSTS.
    if (process.env.NODE_ENV === "production" && req.secure) {
      hsts(req, res, next);
      return;
    }
    next();
  });
}
