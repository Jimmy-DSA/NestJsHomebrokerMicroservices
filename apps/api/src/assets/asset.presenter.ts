import { Asset } from './entities/asset.entity';

export abstract class AssetPresenterAbstract {
  abstract toJSON(asset: Asset): any;
}

export class AssetPresenterDev implements AssetPresenterAbstract {
  constructor() {}

  toJSON(asset: Asset) {
    return {
      _id: asset._id,
      name: asset.name,
      symbol: asset.symbol,
      price: asset.price,
      image_url: `http://localhost:9005/${asset.image}`,
    };
  }
}

export class AssetPresenter implements AssetPresenterAbstract {
  constructor() {}

  toJSON(asset: Asset) {
    return {
      _id: asset._id,
      name: asset.name,
      symbol: asset.symbol,
      price: asset.price,
      image_url: `http://localhost:9000/${asset.image}`,
    };
  }
}
