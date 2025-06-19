FROM node:22.16.0-alpine AS base

FROM base AS build

WORKDIR /app

RUN mkdir -p /app/apps/client-register && mkdir -p /app/libs/core

COPY package.json pnpm-*.yaml ./
COPY apps/client-register/package.json ./apps/client-register/
COPY libs/core/package.json ./libs/core/

RUN corepack enable && pnpm install --frozen-lockfile

COPY apps/client-register/openapi.yaml apps/client-register/tsup.config.ts apps/client-register/tsconfig.json ./apps/client-register/
COPY apps/client-register/src ./apps/client-register/src
COPY libs/core/tsup.config.ts libs/core/tsconfig.json ./libs/core/
COPY libs/core/src ./libs/core/src

RUN pnpm build:client


FROM base AS production

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nodejs

COPY --from=build /app/package.json /app/pnpm-*.yaml ./
COPY --from=build /app/apps/client-register/package.json /app/apps/client-register/openapi.yaml ./apps/client-register/
COPY --from=build /app/apps/client-register/dist ./apps/client-register/dist
COPY --from=build /app/libs/core/package.json ./libs/core/
COPY --from=build /app/libs/core/dist ./libs/core/dist

RUN corepack enable && pnpm install --frozen-lockfile --prod && chown -R nodejs:nodejs /app

USER nodejs
EXPOSE 3000

CMD ["pnpm", "start:client"]
