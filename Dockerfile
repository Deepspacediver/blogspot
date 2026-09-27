ARG NODE_VERSION=24.14.0-slim

FROM node:${NODE_VERSION} AS dependencies

WORKDIR /app

COPY ./package.json ./package-lock.json ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund

FROM node:${NODE_VERSION} AS builder

WORKDIR /app 

ENV ADMIN_DASHBOARD_URL=http://localhost:5173
ENV APP_JWT_SIGNING_SECRET="AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="
ENV APP_JWT_REFRESH_SECRET="AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="
ENV API_JWT_SIGNING_SECRET="AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="
ENV API_JWT_REFRESH_SECRET="AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="


COPY --from=dependencies /app/node_modules ./node_modules
COPY . . 


RUN npm run build

FROM node:${NODE_VERSION} AS runner 

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

WORKDIR /app

RUN mkdir -p .next/cache && chown -R node:node .next

USER node

COPY --chown=node:node --from=builder /app/.next/standalone ./ 
COPY --chown=node:node --from=builder /app/.next/static ./.next/static
COPY --chown=node:node --from=builder /app/public ./public

CMD ["node", "server.js"]
