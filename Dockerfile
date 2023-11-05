FROM node:21-alpine3.18 AS build
WORKDIR /app
RUN npm i -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM httpd:alpine AS runtime
COPY --from=build /app/dist /usr/local/apache2/htdocs/
EXPOSE 80