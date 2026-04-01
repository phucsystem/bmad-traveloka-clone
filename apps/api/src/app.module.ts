import { Module } from "@nestjs/common";
import { LoggerModule } from "nestjs-pino";
import { CacheModule } from "./cache/cache.module";
import { HealthModule } from "./health/health.module";

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        customProps: (_req, _res) => ({ context: "HTTP" }),
        transport:
          process.env.NODE_ENV !== "production"
            ? { target: "pino-pretty", options: { singleLine: true } }
            : undefined,
        autoLogging: true,
        quietReqLogger: false,
        genReqId: (req) =>
          (req.headers["x-request-id"] as string) ??
          crypto.randomUUID(),
      },
    }),
    CacheModule,
    HealthModule,
  ],
})
export class AppModule {}
