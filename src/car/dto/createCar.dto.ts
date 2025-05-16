import { Transform, Type } from 'class-transformer';
import { IsNumber, IsString, IsArray, IsDate } from 'class-validator';

export class CreateCarDto {
  @IsString()
  vin: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  brandId: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  modelId: number;

  @IsString()
  bodyType: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  mileage: number;

  @IsString()
  fuelType: string;

  @IsString()
  transmission: string;

  @IsString()
  condition: string;

  @IsString()
  info: string;

  @Type(() => Date)
  @IsDate()
  firstRegistration: Date;

  @IsString()
  maintenance: string;

  @IsString()
  ecoClass: string;

  @IsString()
  keys: string;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  price: number;

  @IsString()
  specFilename: string;
}
