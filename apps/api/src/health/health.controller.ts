import { Controller, Get, HttpException, HttpStatus } from "@nestjs/common";
import { prisma } from "@repo/database";
import { CacheService } from "../cache/cache.service";
import { ApiResponse } from "@repo/shared";

@Controller("api/health")
export class HealthController {
  constructor(private readonly cacheService: CacheService) {}

  @Get()
  async check(): Promise<ApiResponse<{ db: string; redis: string }>> {
    const results = { db: "error", redis: "error" };

    try {
      await prisma.$queryRaw`SELECT 1`;
      results.db = "ok";
    } catch {
      // db check failed — keep 'error'
    }

    try {
      const pong = await this.cacheService.ping();
      if (pong === "PONG") results.redis = "ok";
    } catch {
      // redis check failed — keep 'error'
    }

    const allOk = results.db === "ok" && results.redis === "ok";
    if (!allOk) {
      throw new HttpException(
        {
          success: false,
          error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "Service degraded",
          },
          data: results,
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    return { success: true, data: results };
  }
}
