FROM node:22.16.0-alpine AS base

FROM base AS build

WORKDIR /app

RUN mkdir -p /app/apps/notification && mkdir -p /app/libs/core

COPY package.json pnpm-*.yaml ./
COPY apps/notification/package.json ./apps/notification/
COPY libs/core/package.json ./libs/core/

RUN corepack enable && pnpm install --frozen-lockfile

COPY apps/notification/tsup.config.ts apps/notification/tsconfig.json ./apps/notification/
COPY apps/notification/src ./apps/notification/src
COPY libs/core/tsup.config.ts libs/core/tsconfig.json ./libs/core/
COPY libs/core/src ./libs/core/src

RUN pnpm build:notification


FROM base AS production

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nodejs

COPY --from=build /app/package.json /app/pnpm-*.yaml ./
COPY --from=build /app/apps/notification/package.json ./apps/notification/
COPY --from=build /app/apps/notification/dist ./apps/notification/dist
COPY --from=build /app/libs/core/package.json ./libs/core/
COPY --from=build /app/libs/core/dist ./libs/core/dist

RUN corepack enable && pnpm install --frozen-lockfile --prod && chown -R nodejs:nodejs /app

USER nodejs

CMD ["pnpm", "start:notification"]
