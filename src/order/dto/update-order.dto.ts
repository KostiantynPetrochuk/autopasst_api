import { IsNumber, IsOptional } from "class-validator";

export class UpdateOrderDto {
  @IsNumber()
  id: number;

  @IsOptional()
  status?: string;

  @IsOptional()
  cancellationReason?: string;

  @IsOptional()
  lastStatusUpdatedById?: number;

  @IsOptional()
  updatedAt?: Date;
}
