import {
  ProcessedOrderDto,
  ProcessedOrderStatus,
} from './../../../microservices/src/dto/processed-order-dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Wallet } from './entities/wallet.entity';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { AssetWallet } from './entities/wallet-asset.entity';
import { Asset } from '../assets/entities/asset.entity';

@Injectable()
export class WalletsService {
  constructor(
    @InjectModel(Wallet.name) private walletSchema: Model<Wallet>,
    @InjectModel(AssetWallet.name)
    private assetWalletSchema: Model<AssetWallet>,
    @InjectModel(Asset.name) private assetSchema: Model<Asset>,
    @InjectConnection()
    private connection: mongoose.Connection,
  ) {}

  async create(createWalletDto: CreateWalletDto) {
    if (await this.walletSchema.findOne({ symbol: createWalletDto })) {
      throw new BadRequestException('Wallet already exists');
    }
    return this.walletSchema.create(createWalletDto);
  }

  findAll() {
    return this.walletSchema
      .find()
      .populate({
        path: 'assets',
        populate: {
          path: 'asset',
          model: Asset.name,
        },
      })
      .exec();
  }

  findOne(symbol: string) {
    return this.walletSchema
      .findOne({ symbol })
      .populate({
        path: 'assets',
        populate: {
          path: 'asset',
          model: Asset.name,
        },
      })
      .exec();
  }

  async createAssetWallet(data: {
    wallet_id: string;
    asset_id: string;
    shares: number;
  }) {
    if (!(await this.walletSchema.findById(data.wallet_id))) {
      throw new BadRequestException('Wallet not found');
    }
    if (!(await this.assetSchema.findById(data.asset_id))) {
      throw new BadRequestException('Asset not found');
    }
    const session = await this.connection.startSession();
    try {
      session.startTransaction();

      const assetWallets = await this.assetWalletSchema.create(
        [
          {
            wallet: data.wallet_id,
            asset: data.asset_id,
            shares: data.shares,
          },
        ],
        { session },
      );
      const randomFail = Math.random() < 0.3; // simular chance de erro
      if (randomFail) {
        throw new Error('create AssetWallet error');
      }
      await this.walletSchema.updateOne(
        { _id: data.wallet_id },
        {
          $push: { assets: assetWallets[0]._id },
        },
        { session },
      );
      const randomFail2 = Math.random() < 0.3; // simular chance de erro
      if (randomFail2) {
        throw new Error('update assets on main wallet error');
      }
      await session.commitTransaction();
      return assetWallets[0];
    } catch (e) {
      console.error(e);
      await session.abortTransaction();
      throw e;
    } finally {
      await session.endSession();
    }
  }

  async updateAssetWallet(data: ProcessedOrderDto) {
    try {
      if (data.status === ProcessedOrderStatus.failed) {
        console.log('Nothing to increment, order proccessing failed.');
        return;
      }
      const result = await this.assetWalletSchema.updateOne(
        { _id: data.assetWalletId },
        { $inc: { shares: data.shares || 0 } },
      );

      if (result.modifiedCount === 0) {
        throw new Error('AssetWallet not found.');
      }

      return result;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error ocurred.';
      throw new Error(`Failed to update AssetWallet: ${errorMessage}`);
    }
  }
}
