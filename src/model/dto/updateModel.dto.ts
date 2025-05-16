import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateModelDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  modelId: number;

  @IsString()
  @IsNotEmpty()
  modelName: string;
}
