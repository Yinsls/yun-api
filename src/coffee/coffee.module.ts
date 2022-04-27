import { Injectable, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from 'src/events/entities/event.entity';
import { Connection } from 'typeorm';
import { COFFEE_BRANDS } from './coffee.constants';
import { CoffeeController } from './coffee.controller';
import { CoffeeService } from './coffee.service';
import coffeeConfig from './config/coffee.config';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';

@Injectable()
export class CoffeeBrandsFactory {
  create() {
    return ['buddy brew', 'nescafa', 'aaa'];
  }
}

@Module({
  imports: [
    TypeOrmModule.forFeature([Coffee, Flavor, Event]),
    ConfigModule.forFeature(coffeeConfig),
  ],
  controllers: [CoffeeController],
  providers: [
    CoffeeService,
    CoffeeBrandsFactory,
    {
      provide: COFFEE_BRANDS,
      useFactory: async (connection: Connection): Promise<string[]> => {
        const brandsFactory = await Promise.resolve(new CoffeeBrandsFactory());
        // console.log('providers.async: ');
        return brandsFactory.create();
      },
      inject: [CoffeeBrandsFactory, Connection],
    },
  ],
  exports: [CoffeeService],
})
export class CoffeeModule {}
