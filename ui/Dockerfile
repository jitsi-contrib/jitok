# ------------------------------------------------------------------------------
# builder
# ------------------------------------------------------------------------------
FROM node:18-alpine as builder

WORKDIR /app

COPY package.json yarn.lock /app/
RUN yarn install

COPY . /app/
RUN yarn build

# ------------------------------------------------------------------------------
# prod
# ------------------------------------------------------------------------------
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/package.json /app/
COPY --from=builder /app/build /app/build
RUN chown node:node /app/build/client/config -R

ENV API_URL "http://127.0.0.1:9000/api"

USER node
EXPOSE 3000

CMD \
    echo $API_URL; \
    echo $API_URL >/app/build/client/config/api-url; \
    node build/index.js
