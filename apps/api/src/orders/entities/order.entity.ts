import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import crypto from 'crypto';
import mongoose, { HydratedDocument } from 'mongoose';
import { Asset, AssetDocument } from '../../assets/entities/asset.entity';
import {
  AssetWallet,
  AssetWalletDocument,
} from '../../wallets/entities/wallet-asset.entity';

export type OrderDocument = HydratedDocument<Order>;
export enum OrderType {
  BUY = 'BUY',
  SELL = 'SELL',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  FAILED = 'FAILED',
}

@Schema({ timestamps: true })
export class Order {
  @Prop({ default: () => crypto.randomUUID() })
  _id: string;

  @Prop({ type: mongoose.Schema.Types.Int32, required: true })
  shares: number;

  @Prop({ type: mongoose.Schema.Types.Int32 })
  partial: number;

  @Prop({ required: true })
  price: number;

  @Prop()
  status: OrderStatus;

  @Prop({ required: true })
  type: OrderType;

  @Prop({ type: String, ref: AssetWallet.name, required: true })
  assetWallet: AssetWalletDocument | string;

  @Prop({ type: String, ref: Asset.name, required: true })
  asset: AssetDocument | string;

  createdAt!: Date;
  updatedAt!: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
