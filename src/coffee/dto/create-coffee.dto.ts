import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCoffeeDto {
  @ApiProperty({ description: 'coffee 名称' })
  @IsString()
  readonly name: string;

  @ApiProperty({ description: 'coffee 品牌' })
  @IsString()
  readonly brand: string;

  @ApiProperty({ example: [], description: 'coffee 风味' })
  @IsString({ each: true })
  readonly flavors: string[];
}
