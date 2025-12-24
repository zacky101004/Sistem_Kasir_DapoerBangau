FROM php:8.2-cli

# ==============================
# System dependencies
# ==============================
RUN apt-get update && apt-get install -y \
    git unzip curl libpng-dev libonig-dev libxml2-dev zip \
    ca-certificates gnupg \
    && rm -rf /var/lib/apt/lists/*

# ==============================
# Node.js 18 (for Vite / React)
# ==============================
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# ==============================
# PHP extensions
# ==============================
RUN docker-php-ext-install \
    pdo pdo_mysql mbstring bcmath gd

# ==============================
# Composer
# ==============================
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# ==============================
# App setup
# ==============================
WORKDIR /app
COPY . .

# ==============================
# Backend dependencies
# ==============================
RUN composer install \
    --no-dev \
    --optimize-autoloader \
    --no-interaction

# ==============================
# Frontend build
# ==============================
RUN npm install
RUN npm run build

# ==============================
# Permissions (Laravel needs this)
# ==============================
RUN chmod -R 777 storage bootstrap/cache

# ==============================
# Expose Railway port
# ==============================
EXPOSE 8080

# ==============================
# Start Laravel (Production Safe)
# ==============================
CMD php artisan storage:link || true && \
    php artisan config:clear && \
    php artisan cache:clear && \
    php artisan serve --host=0.0.0.0 --port=8080
