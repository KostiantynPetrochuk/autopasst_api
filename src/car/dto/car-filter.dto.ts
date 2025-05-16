import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CarFilterDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  condition?: string;

  @IsOptional()
  @Type(() => Number)
  brand?: number;

  @IsOptional()
  @IsString()
  model?: string; // CSV: "1,2,3"

  @IsOptional()
  @IsString()
  bodyType?: string; // CSV

  @IsOptional()
  @IsString()
  fuelType?: string; // CSV

  @IsOptional()
  @IsString()
  transmission?: string; // CSV

  @IsOptional()
  @Type(() => Number)
  mileageFrom?: number;

  @IsOptional()
  @Type(() => Number)
  mileageTo?: number;

  @IsOptional()
  @Type(() => Number)
  priceFrom?: number;

  @IsOptional()
  @Type(() => Number)
  priceTo?: number;

  @IsOptional()
  @IsString()
  sortBy?: 'price_low_to_high' | 'price_high_to_low' | 'newest';

  @IsOptional()
  @Type(() => Number)
  @Min(0)
  offset?: number;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  limit?: number;
}
