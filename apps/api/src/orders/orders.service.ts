import { Injectable, Inject } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderStatus } from './entities/order.entity';
import { Model } from 'mongoose';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import {
  ProcessedOrderDto,
  ProcessedOrderStatus,
} from 'apps/microservices/src/dto/processed-order-dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderSchema: Model<Order>,
    @Inject('ORDER_SERVICE') private readonly orderClient: ClientProxy,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const createdOrder = await this.orderSchema.create({
      assetWallet: createOrderDto.assetWalletId,
      asset: createOrderDto.assetId,
      shares: createOrderDto.shares,
      price: createOrderDto.price,
      type: createOrderDto.type,
      partial: createOrderDto.shares,
      status: OrderStatus.PENDING,
    });
    await lastValueFrom(this.orderClient.emit('order_created', createdOrder));
    return createdOrder;
  }

  findAll(filter: { walletId: string }) {
    return this.orderSchema.find({ wallet: filter.walletId });
  }

  findOne(id: string) {
    return this.orderSchema.findById(id);
  }

  async updateOrderStatus(data: ProcessedOrderDto) {
    try {
      if (!data.orderId) {
        throw new Error('orderId missing');
      }

      let newStatus: OrderStatus;
      const update: { $set: { status?: OrderStatus; partial?: number } } = {
        $set: {},
      };

      if (data.status === ProcessedOrderStatus.failed) {
        newStatus = OrderStatus.FAILED;
        update.$set = { status: newStatus };
        console.log('successfully updated order status to FAILED');
      } else if (data.status === ProcessedOrderStatus.success) {
        newStatus = OrderStatus.CLOSED;
        update.$set = {
          status: newStatus,
          partial: 0,
        };
        console.log('successfully updated order status to CLOSED');
      } else {
        throw new Error('Invalid order status');
      }

      const result = await this.orderSchema.updateOne(
        { _id: data.orderId },
        update,
      );

      if (result.modifiedCount === 0) {
        console.warn(
          `Nenhum pedido atualizado. Verifique o ID: ${data.orderId}`,
        );
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error ocurrend';
      console.error('Erro ao atualizar status do pedido:', error);
      throw new Error(`Failed to update order status: ${errorMessage}`);
    }
  }
}
