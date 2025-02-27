import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAssetDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  symbol: string;
  @IsNotEmpty()
  @IsNumber()
  price: number;
  @IsNotEmpty()
  image: string;
}
