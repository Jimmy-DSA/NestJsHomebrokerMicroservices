import { OrderType } from '../entities/order.entity';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  assetWalletId: string;

  @IsNotEmpty()
  @IsString()
  assetId: string;

  @IsNotEmpty()
  @IsNumber()
  shares: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsEnum(OrderType, { message: 'Type must be BUY or SELL' })
  type: OrderType;
}
