import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateModelDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  brandId: number;

  @IsString()
  @IsNotEmpty()
  modelName: string;
}
