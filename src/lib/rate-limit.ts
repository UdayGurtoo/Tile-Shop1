type Bucket = { count: number; resetAt: number };

const memory = new Map<string, Bucket>();

export async function rateLimit(
  key: string,
  limit = 20,
  windowMs = 60_000
): Promise<{ success: boolean; remaining: number }> {
  const now = Date.now();

  // Prefer Upstash when configured
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    try {
      const { Ratelimit } = await import("@upstash/ratelimit");
      const { Redis } = await import("@upstash/redis");
      const ratelimit = new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(limit, `${Math.ceil(windowMs / 1000)} s`),
        analytics: false,
      });
      const result = await ratelimit.limit(key);
      return { success: result.success, remaining: result.remaining };
    } catch {
      // fall through to memory
    }
  }

  const bucket = memory.get(key);
  if (!bucket || bucket.resetAt < now) {
    memory.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  if (bucket.count >= limit) {
    return { success: false, remaining: 0 };
  }

  bucket.count += 1;
  memory.set(key, bucket);
  return { success: true, remaining: limit - bucket.count };
}
