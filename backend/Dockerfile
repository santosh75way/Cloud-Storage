FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

COPY . .

RUN npx prisma generate

RUN npm run build

FROM node:22-alpine AS runner

WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --omit=dev
RUN npx  generate

COPY --from=builder /app/dist ./dist

RUN mkdir -p logs && chown -R node:node logs

USER node

EXPOSE 8000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]