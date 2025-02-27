import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import crypto from 'crypto';
import mongoose, { HydratedDocument } from 'mongoose';
import { WalletDocument } from './wallet.entity';
import { Asset, AssetDocument } from '../../assets/entities/asset.entity';

export type AssetWalletDocument = HydratedDocument<AssetWallet>;

@Schema({ timestamps: true })
export class AssetWallet {
  @Prop({ default: () => crypto.randomUUID() })
  _id: string;

  @Prop({ type: mongoose.Schema.Types.Int32 })
  shares: number;

  @Prop({ type: String, ref: 'Wallet' })
  wallet: WalletDocument | string;

  @Prop({ type: String, ref: Asset.name })
  asset: AssetDocument | string;

  createdAt!: Date;
  updatedAt!: Date;
}

export const AssetWalletSchema = SchemaFactory.createForClass(AssetWallet);

AssetWalletSchema.index({ wallet: 1, asset: 1 }, { unique: true });
