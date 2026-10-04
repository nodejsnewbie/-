import { Body, Controller, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import type { CartItem } from '@hnhall/shared';

import { MallCatalogService } from './mall-catalog.service';
import { MallTradeService } from './mall-trade.service';

/**
 * C 端商城（农资自营商城）路由，自 E:\repo\zymall 的 Express Mock 原样迁入。
 * 业务逻辑在 mall-*.service.ts；路由前缀沿用原型，保证前端调用路径不变。
 * `POST /api/orders` 与企业后台的 `POST /api/orders/:id/dispatch`（modules/order）路径不冲突。
 */

/** 商城商品目录：`GET /api/products`、`GET /api/products/:id`。 */
@Controller('products')
export class MallProductController {
  constructor(private readonly catalog: MallCatalogService) {}

  @Get()
  async list(@Query() query: Record<string, string | undefined>) {
    return this.catalog.listProducts(query);
  }

  @Get(':id')
  async detail(@Param('id') id: string) {
    return this.catalog.productDetail(id);
  }
}

/** 商城健康检查：`GET /api/health`（响应形状沿用 zymall 原型）。 */
@Controller('health')
export class MallHealthController {
  constructor(private readonly catalog: MallCatalogService) {}

  @Get()
  check() {
    return this.catalog.health();
  }
}

/** 农业气象与飞防指数：`GET /api/weather`。⚠️ 静态示意值，无真实气象数据来源。 */
@Controller('weather')
export class MallWeatherController {
  constructor(private readonly catalog: MallCatalogService) {}

  @Get()
  weather() {
    return this.catalog.weather();
  }
}

/** 上门服务预约：`GET /api/bookings`、`POST /api/bookings`。 */
@Controller('bookings')
export class MallBookingController {
  constructor(private readonly trade: MallTradeService) {}

  @Get()
  async list() {
    return this.trade.listBookings();
  }

  @Post()
  @HttpCode(200)
  async create(@Body() body: Record<string, unknown>) {
    return this.trade.createBooking(body);
  }
}

/** 商城下单（采购结算）：`POST /api/orders`。 */
@Controller('orders')
export class MallOrderController {
  constructor(private readonly trade: MallTradeService) {}

  @Post()
  @HttpCode(200)
  async create(@Body() body: { items?: CartItem[]; station?: string }) {
    return this.trade.createOrder(body);
  }
}
