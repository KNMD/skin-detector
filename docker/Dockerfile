FROM --platform=linux/amd64 node:18-slim AS base
# FROM node:18-slim AS base

# # Install dependencies only when needed
FROM base AS deps
# # Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
# RUN apt-get update -q \
#     && apt-get install -y --no-install-recommends  gcc g++ make libc6-dev python3 \
#     && rm -rf /var/lib/apt/lists/*

# RUN apk add --no-cache libvips

WORKDIR /app

# # Install dependencies based on the preferred package manager
COPY package.json pnpm-lock.yaml* ./
# RUN yarn global add pnpm 
RUN npm i pnpm -g
RUN pnpm i --frozen-lockfile;


# # Rebuild the source code only when needed
FROM deps AS builder
WORKDIR /app

# # RUN yarn build
# # If using npm comment out above and use below instead
COPY --from=deps /app/node_modules ./node_modules

COPY . .


RUN pnpm run build


# # Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# # Uncomment the following line in case you want to disable telemetry during runtime.
# # ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./next
COPY  --chown=nextjs:nodejs ./.env.production ./


# # Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# # Automatically leverage output traces to reduce image size
# # https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# COPY  --chown=nextjs:nodejs ./docker/entrypoint.sh  ./
# COPY  --chown=nextjs:nodejs .env.production  ./
# RUN ["chmod", "777", ".env.production"]
# RUN ["chmod", "777", "entrypoint.sh"]

USER root

EXPOSE 3000

ENV PORT 3000
# # set hostname to localhost
ENV HOSTNAME "0.0.0.0"

# ENTRYPOINT ["bash" , "./entrypoint.sh"]

CMD ["node", "server.js"]
