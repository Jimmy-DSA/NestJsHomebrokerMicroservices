import { Test, TestingModule } from '@nestjs/testing';
import { MicroservicesController } from './microservices.controller';
import { MicroservicesService } from './microservices.service';

describe('MicroservicesController', () => {
  let microservicesController: MicroservicesController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MicroservicesController],
      providers: [MicroservicesService],
    }).compile();

    microservicesController = app.get<MicroservicesController>(MicroservicesController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(microservicesController.getHello()).toBe('Hello World!');
    });
  });
});
