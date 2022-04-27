import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ApiKeyGuard } from './guards/api-key.guard';
import { LoggingMiddleware } from './middleware/logging.middleware';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },
  ],
})
// NestModule.configure可以将中间件挂载到特定路由中
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 只对coffee中的Get请求生效： http://localhost/coffee
    // consumer.apply(LoggingMiddleware).forRoutes({path: 'coffee', method: RequestMethod.GET});

    // 排除某路由之外生效
    // consumer.apply(LoggingMiddleware).exclude('coffee').forRoutes('*');

    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
