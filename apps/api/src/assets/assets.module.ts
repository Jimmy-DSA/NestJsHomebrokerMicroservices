import { Module } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { AssetsController } from './assets.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Asset, AssetSchema } from './entities/asset.entity';
import { AssetPresenter, AssetPresenterAbstract } from './asset.presenter';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Asset.name, schema: AssetSchema }]),
  ],
  controllers: [AssetsController],
  providers: [
    AssetsService,
    {
      provide: AssetPresenterAbstract,
      useClass: AssetPresenter,
    },
  ],
})
export class AssetsModule {}
