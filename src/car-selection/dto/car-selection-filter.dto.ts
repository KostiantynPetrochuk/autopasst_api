import { IsOptional, IsString, IsDate, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CarSelectionFilterDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  countryOfExploitation?: string;

  @IsOptional()
  @Type(() => Date)
  createdAt?: Date;

  @IsOptional()
  @Type(() => Number)
  @Min(0)
  offset?: number;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  limit?: number;
}
