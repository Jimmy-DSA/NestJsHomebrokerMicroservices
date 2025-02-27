import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ProcessedOrderDto } from 'apps/microservices/src/dto/processed-order-dto';

@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Post()
  create(@Body() createWalletDto: CreateWalletDto) {
    return this.walletsService.create(createWalletDto);
  }

  @Get()
  findAll() {
    return this.walletsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.walletsService.findOne(id);
  }

  @Post(':id/assets')
  async createAssetWallet(
    @Param('id') id: string,
    @Body() data: { assetId: string; shares: number },
  ) {
    try {
      return await this.walletsService.createAssetWallet({
        wallet_id: id,
        asset_id: data.assetId,
        shares: data.shares,
      });
    } catch (e) {
      console.error('Error in createAssetWallet:', e);

      if (e instanceof Error) {
        throw new BadRequestException(e.message || 'An error occurred');
      }

      throw new BadRequestException(
        'An error occurred while processing the request',
      );
    }
  }

  @EventPattern('order_processed')
  async handleOrderProcessed(@Payload() data: ProcessedOrderDto) {
    console.log('order_processed event received in wallets:', data);
    await this.walletsService.updateAssetWallet(data);
  }
}
