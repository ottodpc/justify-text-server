import { RateLimiterMemory } from "rate-limiter-flexible";

/**
 * @Throttle
 * @param points
 * @param duration
 * @returns
 * @example @Throttle(5, 60) // Limite à 5 requêtes par minute
 */
export function Throttle(points: number, duration: number): MethodDecorator {
  const rateLimiter = new RateLimiterMemory({
    points,
    duration,
  });

  return function (target, propertyKey, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const [req, res] = args;
      try {
        await rateLimiter.consume(req.ip);
        return originalMethod.apply(this, args);
      } catch {
        res.status(429).send("Too many requests");
      }
    };

    return descriptor;
  };
}
