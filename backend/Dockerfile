FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN apk add --no-cache openssl curl

RUN addgroup --system --gid 1001 nodejs
RUN adduser  --system --uid 1001 nextjs

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static   ./.next/static
COPY --from=builder /app/prisma         ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/prisma  ./node_modules/prisma

RUN mkdir -p /app/prisma /app/public/uploads \
    && chown -R nextjs:nodejs /app/prisma /app/public/uploads \
         /app/node_modules/.prisma /app/node_modules/@prisma /app/node_modules/prisma

USER nextjs
EXPOSE 3001
ENV PORT=3001

CMD ["sh", "-c", "node node_modules/prisma/build/index.js db push && node server.js"]
