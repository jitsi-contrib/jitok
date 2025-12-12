# ------------------------------------------------------------------------------
# builder
# ------------------------------------------------------------------------------
FROM node:24-alpine as builder

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
