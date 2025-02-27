/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { AssetPresenterAbstract } from './asset.presenter';

@Controller('assets')
export class AssetsController {
  constructor(
    private readonly assetsService: AssetsService,
    private readonly assetPresenter: AssetPresenterAbstract,
  ) {}

  @Post()
  async create(@Body() createAssetDto: CreateAssetDto) {
    const createdAsset = await this.assetsService.create(createAssetDto);
    return this.assetPresenter.toJSON(createdAsset);
  }

  @Get()
  async findAll() {
    const assets = await this.assetsService.findAll();
    return assets.map((asset) => this.assetPresenter.toJSON(asset));
  }

  @Get(':symbol')
  async findOne(@Param('symbol') symbol: string) {
    const asset = await this.assetsService.findOne(symbol);
    if (!asset) return null;
    return this.assetPresenter.toJSON(asset);
  }
}
