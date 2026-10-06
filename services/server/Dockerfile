# =============================================================================
# 华农智服统一后端镜像（NestJS + Prisma/PostgreSQL）
# 构建上下文 = 仓库根（npm workspaces：lockfile 与全部 workspace manifest 必须同源）
# 运行期 @hnhall/shared 为纯类型引用（import type，运行期擦除），拷入仅为保险
# 数据库：PostgreSQL（连接串经 DATABASE_URL 注入；生产为 linyuan-infra shared-postgres，
#         见 docker-compose.cloud.yml 与 docs/DEPLOYMENT.md）
# =============================================================================

# ---------- 构建阶段：全量依赖 + nest build + prisma generate ----------
FROM node:22-bookworm-slim AS build
WORKDIR /app
ENV NPM_CONFIG_FUND=false \
    NPM_CONFIG_AUDIT=false

# 先只拷 manifest（任意 workspace 源码变化不击穿依赖层缓存）
COPY package.json package-lock.json ./
COPY apps/admin/package.json apps/admin/package.json
COPY apps/user/package.json apps/user/package.json
COPY apps/technician/package.json apps/technician/package.json
COPY packages/shared/package.json packages/shared/package.json
COPY services/server/package.json services/server/package.json

# openssl 必须在 npm ci 之前就位：Prisma 依赖它检测 binaryTarget，
# 缺失会静默回退 openssl-1.1.x 引擎，与运行时（3.0.x）不匹配导致 client 无法加载
RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*
RUN --mount=type=cache,target=/root/.npm npm ci

# 拷 shared + server 源码并构建（前端源码不进后端镜像）
COPY packages/shared packages/shared
COPY services/server services/server
RUN npx prisma generate --schema=services/server/prisma/schema.prisma \
    && npm run build -w @hnhall/server

# ---------- 运行阶段：仅带走运行所需 ----------
FROM node:22-bookworm-slim
ENV NODE_ENV=production \
    PORT=3000
WORKDIR /app

# Prisma 引擎依赖 openssl（bookworm-slim 默认不带）
RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# workspaces 提升的依赖在根 node_modules；server 自身嵌套依赖单独带走
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/services/server/node_modules ./services/server/node_modules
COPY --from=build /app/services/server/dist ./services/server/dist
COPY --from=build /app/services/server/prisma ./services/server/prisma
COPY --from=build /app/packages/shared ./packages/shared
COPY package.json package-lock.json ./
COPY services/server/package.json services/server/package.json

EXPOSE 3000

# 启动前先跑迁移（幂等；生产库不播种——红线 R4）
# 注意：不经过 npx（其更新检查会连 registry，离线/受控网络下挂起）；直接调本地 bin
CMD ["sh", "-c", "node_modules/.bin/prisma migrate deploy --schema=services/server/prisma/schema.prisma && exec node services/server/dist/main.js"]
