import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let ratelimit: Ratelimit | null = null;

// Initialize Redis only if environment parameters are provided
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, "1 h"),
      analytics: true,
      prefix: "moedren-folio-ratelimit",
    });
  } catch (error) {
    console.error("❌ Failed to initialize Upstash Redis rate-limiter client:", error);
  }
} else {
  console.warn(
    "⚠️ Warning: UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN is missing. Rate limiting is disabled."
  );
}

/**
 * Checks client IP address limit criteria.
 * Adopts a fail-open philosophy so database/redis hiccups don't lock out legitimate users.
 */
export async function checkRateLimit(ip: string): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}> {
  if (!ratelimit) {
    return { success: true, limit: 999, remaining: 999, reset: 0 };
  }

  try {
    const result = await ratelimit.limit(ip);
    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    };
  } catch (error) {
    console.error("❌ Redis rate limiting execution failed (failing-open):", error);
    return { success: true, limit: 999, remaining: 999, reset: 0 };
  }
}
