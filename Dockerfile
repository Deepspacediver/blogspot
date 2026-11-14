ARG NODE_VERSION=24.14.0-slim

FROM node:${NODE_VERSION} AS dependencies

WORKDIR /app

COPY ./package.json ./package-lock.json ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund

FROM node:${NODE_VERSION} AS builder

WORKDIR /app 

COPY --from=dependencies /app/node_modules ./node_modules
COPY . . 


RUN npm run build

FROM node:${NODE_VERSION} AS runner 

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

WORKDIR /app

RUN mkdir -p .next/cache && chown -R node:node .next

USER root

# 1. Patch OS packages (fixes libgnutls30, perl-base)
# 2. Remove global npm to eliminate bundled tar vulnerability
RUN apt-get update && apt-get upgrade -y \
    && rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx \
    && rm -rf /var/lib/apt/lists/*
USER node

COPY --chown=node:node --from=builder /app/.next/standalone ./ 
COPY --chown=node:node --from=builder /app/.next/static ./.next/static
COPY --chown=node:node --from=builder /app/public ./public

CMD ["node", "server.js"]
