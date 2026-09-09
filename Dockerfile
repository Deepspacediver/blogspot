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

USER node

COPY --chown=node:node --from=builder /app/.next/standalone ./ 
COPY --chown=node:node --from=builder /app/.next/static ./.next/static
COPY --chown=node:node --from=builder /app/public ./public

CMD ["node", "server.js"]
