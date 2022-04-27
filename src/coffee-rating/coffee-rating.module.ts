import { Module } from '@nestjs/common';
import { CoffeeModule } from 'src/coffee/coffee.module';
import { DatabaseModule } from 'src/database/database.module';
import { CoffeeRatingService } from './coffee-rating.service';

@Module({
  imports: [
    // 通过不同传参返回不同的模块，达到动态模块效果，如权限管理
    DatabaseModule.register({
      type: 'mysql',
      host: 'localhost',
      password: 'xxxx',
      port: 3306,
    }),
    CoffeeModule,
  ],
  providers: [CoffeeRatingService],
})
export class CoffeeRatingModule {}
