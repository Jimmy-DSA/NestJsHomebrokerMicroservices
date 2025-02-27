import { ProcessedOrderDto } from './dto/processed-order-dto';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { OrderDocument } from 'apps/api/src/orders/entities/order.entity';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class MicroservicesService {
  constructor(
    @Inject('RESPONSE_SERVICE') private readonly responseClient: ClientProxy,
  ) {}

  async processOrder(orderData: OrderDocument) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const isSuccess = Math.random() > 0.5;

      console.log(
        isSuccess ? 'successfully processed order' : 'failed to process order',
      );

      const processedOrder = plainToInstance(ProcessedOrderDto, {
        orderId: orderData._id,
        assetWalletId: orderData.assetWallet,
        shares: isSuccess ? orderData.shares : undefined,
        status: isSuccess ? 'SUCCESS' : 'FAILED',
        message: 'Order processed successfully',
      });

      const errors = await validate(processedOrder);
      const errorMessages = errors.map((e) => ({
        field: e.property,
        errors: Object.values(e.constraints || {}),
      }));

      if (errors.length > 0) {
        console.error('DTO validate errors:', errors);
        this.responseClient.emit('order_processed', {
          orderId: orderData._id,
          status: 'FAILED',
          message: errorMessages,
        });
        return;
      }

      if (isSuccess) {
        const responseObservable = this.responseClient.emit(
          'order_processed',
          processedOrder,
        );
        await lastValueFrom(responseObservable);
      } else {
        const responseObservable = this.responseClient.emit(
          'order_processed',
          processedOrder,
        );
        await lastValueFrom(responseObservable);
      }
    } catch (error: unknown) {
      console.error('Error processing order:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred';
      const responseObservable = this.responseClient.emit('order_processed', {
        orderId: orderData._id,
        status: 'FAILED',
        message: errorMessage,
      });
      await lastValueFrom(responseObservable);
    }
  }
}
