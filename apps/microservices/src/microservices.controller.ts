import { Controller } from '@nestjs/common';
import { MicroservicesService } from './microservices.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrderDocument } from 'apps/api/src/orders/entities/order.entity';

@Controller()
export class MicroservicesController {
  constructor(private readonly microservice: MicroservicesService) {}

  @MessagePattern('order_created')
  async handleOrderCreated(@Payload() data: OrderDocument) {
    console.log('Received message:', data);
    await this.microservice.processOrder(data);
  }
}
