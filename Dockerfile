
FROM php:8.3-fpm-bookworm

# --------------------------------------------------
# 1. Install system dependencies and PHP extensions
# --------------------------------------------------

# Install system dependencies and PHP extensions
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    nginx \
    curl \
    ca-certificates \
    git \
    unzip \
    libpq-dev \
    libzip-dev \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    libicu-dev \
    libxml2-dev \
    libcurl4-openssl-dev \
    libonig-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j"$(nproc)" \
    pdo_pgsql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    intl \
    zip \
    curl \
    dom \
    xml \
    opcache \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*


# --------------------------------------------------
# 2. Install Node.js 22 and npm
# --------------------------------------------------
RUN curl -fsSL https://deb.nodesource.com/setup_22.x \
    -o /tmp/nodesource_setup.sh \
    && bash /tmp/nodesource_setup.sh \
    && apt-get update \
    && apt-get install -y --no-install-recommends nodejs \
    && node --version \
    && npm --version \
    && rm -f /tmp/nodesource_setup.sh \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# --------------------------------------------------
# 3. Install Composer
# --------------------------------------------------
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# --------------------------------------------------
# 4. Install Laravel dependencies
# --------------------------------------------------
COPY composer.json composer.lock ./

RUN composer install \
    --no-dev \
    --no-interaction \
    --prefer-dist \
    --optimize-autoloader \
    --no-scripts

# --------------------------------------------------
# 5. Copy Laravel application
# --------------------------------------------------
COPY . .

# Generate optimized Composer autoload files.
RUN composer dump-autoload \
    --no-dev \
    --optimize \
    --no-scripts

# --------------------------------------------------
# 6. Build React / Inertia frontend
# --------------------------------------------------
COPY package.json package-lock.json ./

RUN npm ci \
    && DOCKER_BUILD=1 npm run build \
    && npm cache clean --force \
    && rm -rf node_modules

# --------------------------------------------------
# 7. Prepare Laravel writable directories
# --------------------------------------------------
RUN mkdir -p \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R ug+rwx storage bootstrap/cache

# --------------------------------------------------
# 8. Configure Nginx and container startup
# --------------------------------------------------
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/start.sh /usr/local/bin/start-app

RUN sed -i 's/\r$//' /usr/local/bin/start-app \
    && chmod +x /usr/local/bin/start-app \
    && rm -f /etc/nginx/sites-enabled/default

ENV APP_ENV=production
ENV APP_DEBUG=false
ENV LOG_CHANNEL=stderr

EXPOSE 10000

CMD ["/usr/local/bin/start-app"]
