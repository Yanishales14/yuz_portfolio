/**
 * Client-side rate limiter.
 */

export function createRateLimiter(maxAttempts: number, windowMs: number) {
  const attempts: number[] = [];

  return {
    check(): boolean {
      const now = Date.now();
      while (attempts.length > 0 && attempts[0] < now - windowMs) attempts.shift();
      return attempts.length < maxAttempts;
    },
    record(): void {
      attempts.push(Date.now());
    },
    remaining(): number {
      const now = Date.now();
      while (attempts.length > 0 && attempts[0] < now - windowMs) attempts.shift();
      return Math.max(0, maxAttempts - attempts.length);
    },
    reset(): void {
      attempts.length = 0;
    },
  };
}

// Admin login: 5 attempts per 15 minutes
export const adminRateLimiter = createRateLimiter(5, 15 * 60 * 1000);

// YouTube meta fetch: 20 per minute
export const metaFetchLimiter = createRateLimiter(20, 60 * 1000);
