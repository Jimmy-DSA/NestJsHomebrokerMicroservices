import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export enum ProcessedOrderStatus {
  failed = 'FAILED',
  success = 'SUCCESS',
}

export class ProcessedOrderDto {
  @IsNotEmpty()
  orderId: string;

  @IsOptional()
  @IsString()
  assetWalletId: string;

  @IsOptional()
  @IsNumber()
  shares: number;

  @IsNotEmpty()
  @IsEnum(ProcessedOrderStatus)
  status: ProcessedOrderStatus;

  @IsNotEmpty()
  message: string;
}
