FROM oven/bun:1.3.0-alpine AS base

WORKDIR /opt/app
COPY package.json bun.lock ./

FROM base AS install

RUN --mount=type=secret,id=npmrc,dst=/root/.npmrc bun install --frozen-lockfile --ignore-scripts --production

FROM base AS builder

# Dependencies
RUN --mount=type=secret,id=npmrc,dst=/root/.npmrc bun install --frozen-lockfile --ignore-scripts

# Config files
COPY biome.json panda.config.ts postcss.config.cjs tsconfig.json vite.config.ts ./

# Source files
COPY lib/ ./lib/
COPY public/ ./public/
COPY src/ ./src/

# Build
RUN bun prepare
RUN bun run build

ENV NODE_ENV=production
RUN bun test

FROM base AS release

COPY --from=install /opt/app/node_modules ./node_modules
COPY --from=builder /opt/app/.output/ ./.output/

USER bun
EXPOSE 3000/tcp
CMD ["bun", "start"]
