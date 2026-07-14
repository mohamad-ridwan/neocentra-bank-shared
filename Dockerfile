# Multi-stage build for Next.js Micro Frontend with Root Context
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package.json files
COPY neocentra-bank-shared/package.json neocentra-bank-shared/package-lock.json ./neocentra-bank-shared/
WORKDIR /app/neocentra-bank-shared
RUN npm install

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy dependency node_modules
COPY --from=deps /app/neocentra-bank-shared/node_modules ./neocentra-bank-shared/node_modules

# Copy source code of MFE
COPY neocentra-bank-shared ./neocentra-bank-shared

ENV NODE_ENV=production
ENV NEXT_PRIVATE_LOCAL_WEBPACK=true

# Bake production environment variables during build time for Next.js bundle compilation
ENV NEXT_PUBLIC_HOST_API_URL=https://neocentra.bank.com

WORKDIR /app/neocentra-bank-shared
RUN npm run build

# Production runner image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_PRIVATE_LOCAL_WEBPACK=true
ENV PORT=3342
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy MFE files
WORKDIR /app/neocentra-bank-shared
COPY --from=builder /app/neocentra-bank-shared/public ./public
COPY --from=builder /app/neocentra-bank-shared/package.json ./package.json
COPY --from=builder /app/neocentra-bank-shared/next.config.js ./next.config.js
COPY --from=builder --chown=nextjs:nodejs /app/neocentra-bank-shared/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/neocentra-bank-shared/node_modules ./node_modules

USER nextjs

EXPOSE 3342

CMD ["npm", "run", "start"]
