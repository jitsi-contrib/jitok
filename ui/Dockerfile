# ------------------------------------------------------------------------------
# builder
# ------------------------------------------------------------------------------
FROM node:18-alpine as builder

WORKDIR /app

COPY package.json yarn.lock /app/
RUN yarn install

COPY . /app/
RUN sh prebuild.sh && yarn build

# ------------------------------------------------------------------------------
# prod
# ------------------------------------------------------------------------------
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/static /app/
COPY --from=builder /app/build /app/

USER node
EXPOSE 3000

CMD ["node", "build/index.js"]
