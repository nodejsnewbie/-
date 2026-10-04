import { Injectable, NotFoundException } from '@nestjs/common';

import { MallProductRepository } from '../../database/repositories/mall.repository';

/** C 端商城：商品目录 + 气象 + 健康检查业务逻辑。 */
@Injectable()
export class MallCatalogService {
  constructor(private readonly products: MallProductRepository) {}

  async listProducts(query: Record<string, string | undefined>) {
    const { category, q } = query;
    let list = await this.products.list();

    if (category && category !== '全部') {
      list = list.filter((p) => p.category === category);
    }

    if (q && typeof q === 'string') {
      const keyword = q.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(keyword) ||
          p.licenseNo.toLowerCase().includes(keyword) ||
          p.tags.some((t) => t.toLowerCase().includes(keyword)) ||
          p.targetDisease.toLowerCase().includes(keyword),
      );
    }

    return { success: true, data: list, total: list.length };
  }

  async productDetail(id: string) {
    const product = await this.products.findById(id);
    if (!product) {
      throw new NotFoundException({ success: false, error: '商品不存在' });
    }
    return { success: true, data: product };
  }

  /** ⚠️ 静态示意值，无真实气象数据来源。 */
  weather() {
    return {
      success: true,
      data: {
        station: '长沙县安沙水渡河监测站',
        temperature: 26,
        humidity: 64,
        windSpeed: 1.8,
        windDirection: '东南风 2级',
        precipitationChance: 5,
        droneSprayIndex: '适宜飞防',
        reason: '气温适宜，平均风速小于3m/s，药滴沉降附着率高，无逆温飘移风险',
      },
    };
  }

  /** 响应形状沿用 zymall 原型。⚠️ `connectedNationalDb` 原型写死 true（监管接口权限申请中）。 */
  health() {
    return {
      status: 'healthy',
      service: 'agro-mall-backend',
      timestamp: new Date().toISOString(),
      connectedNationalDb: true,
      registeredLicense: '农药经湘20240018',
    };
  }
}
