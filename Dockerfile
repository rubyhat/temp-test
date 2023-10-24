FROM node:12-alpine as openapi

RUN apk update && apk add openjdk8

WORKDIR /var/app
COPY package*.json ./

COPY ./swagger ./swagger
RUN npm run build-openapi

FROM node:12-alpine as localazy
RUN apk update && apk add ca-certificates
WORKDIR /var/app
COPY ./bin ./bin
COPY localazy.json ./
COPY ./CACHEBUST ./CACHEBUST
RUN cat ./CACHEBUST
RUN npx @localazy/cli download

FROM node:12-alpine
WORKDIR /var/app
COPY package*.json ./
RUN npm install

ARG SENTRY_AUTH_TOKEN
ARG BUILD_VERSION
ARG SOURCEMAPS

COPY . ./
COPY --from=openapi /var/app/swagger /var/app/swagger
COPY --from=localazy /var/app/public/static/locales /var/app/public/static/locales
RUN npm run saas \
    && npm run build \
    && /bin/sh bin/sentry-upload-sourcemaps.sh \
    && find .next/static -name "*.js.map" -exec rm -rf {} \; -print

CMD npm run start
