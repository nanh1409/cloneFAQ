FROM node:14-alpine AS deps
WORKDIR /usr/app
COPY . .
RUN yarn
RUN yarn build
RUN rm -rf /usr/app/node_modules
RUN yarn install --production --ignore-scripts --prefer-offline

FROM osgeo/gdal:alpine-small-3.2.2 as runner
WORKDIR /usr/app
RUN apk add --no-cache --update nodejs-current ghostscript graphicsmagick
COPY --from=deps /usr/app/node_modules /usr/app/node_modules
COPY package.json ./
COPY .env.production.local ./
# COPY .env.local ./
COPY --from=deps /usr/app/.next /usr/app/.next
COPY public /usr/app/public
COPY config /usr/app/config
COPY next.config.js ./
COPY next-sitemap.config.js ./
RUN /usr/app/node_modules/next-sitemap/bin/next-sitemap --config next-sitemap.config.js

EXPOSE 3000
CMD [ "/usr/app/node_modules/next/dist/bin/next", "start" ]