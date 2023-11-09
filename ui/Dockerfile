# ------------------------------------------------------------------------------
# builder
# ------------------------------------------------------------------------------
FROM node:20-alpine as builder

WORKDIR /app

COPY package.json yarn.lock /app/
RUN yarn install

COPY . /app/
RUN yarn build

# ------------------------------------------------------------------------------
# prod
# ------------------------------------------------------------------------------
FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html
