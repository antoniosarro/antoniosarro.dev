# Build stage
FROM node:25-alpine AS builder

# Install Python and required packages for font optimization
RUN apk add --no-cache \
    python3 \
    py3-pip \
    make \
    g++ \
    git \
    && python3 -m venv /opt/venv \
    && . /opt/venv/bin/activate \
    && pip install --no-cache-dir fonttools brotli zopfli

ENV PATH="/opt/venv/bin:$PATH"

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./

RUN npm install -g pnpm@10.26.0 && \
    pnpm install --frozen-lockfile --prod=false

COPY .git .git
COPY . .

ARG PUBLIC_UMAMI_WEBSITE_ID=""
ARG PUBLIC_UMAMI_SERVER_REMOTE=""
ARG PUBLIC_GISCUS_REPO_ID=""
ARG PUBLIC_GISCUS_CATEGORY_ID=""
ARG PUBLIC_SITE_URL="https://antoniosarro.dev"
ARG GITHUB_API_TOKEN=""
ARG COMMIT_SHA=""

ENV PUBLIC_UMAMI_WEBSITE_ID=$PUBLIC_UMAMI_WEBSITE_ID
ENV PUBLIC_UMAMI_SERVER_REMOTE=$PUBLIC_UMAMI_SERVER_REMOTE
ENV PUBLIC_GISCUS_REPO_ID=$PUBLIC_GISCUS_REPO_ID
ENV PUBLIC_GISCUS_CATEGORY_ID=$PUBLIC_GISCUS_CATEGORY_ID
ENV PUBLIC_SITE_URL=$PUBLIC_SITE_URL
ENV GITHUB_API_TOKEN=$GITHUB_API_TOKEN
ENV COMMIT_SHA=$COMMIT_SHA

# Copy unoptimized assets
COPY assets ./assets

# Single build command that handles everything in order
RUN pnpm run build:prod && \
    # Cleanup unnecessary files
    find /app/build -type f -name "*.map" -delete && \
    find /app/build -type f -name "*.ts" -delete && \
    find /app/build -type f -name "*.md" ! -name "README.md" -delete

# Production stage
FROM nginx:alpine-slim AS production

RUN apk add --no-cache ca-certificates && \
    rm -rf /var/cache/apk/*

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /app/build /usr/share/nginx/html

RUN addgroup -g 1001 -S nginx-user && \
    adduser -S -D -H -u 1001 -h /var/cache/nginx -s /sbin/nologin -G nginx-user -g nginx-user nginx-user && \
    chown -R nginx-user:nginx-user /usr/share/nginx/html && \
    chown -R nginx-user:nginx-user /var/cache/nginx && \
    chown -R nginx-user:nginx-user /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R nginx-user:nginx-user /var/run/nginx.pid && \
    rm -rf /usr/share/nginx/html/50x.html

USER nginx-user

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]