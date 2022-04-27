import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.time(`Request-response time`);
    // 希望监听用时的操作...
    // to do ...

    res.on('finish', () => console.timeEnd(`Request-response time`)); // 查看console.time到finish之间用时
    next();
  }
}
