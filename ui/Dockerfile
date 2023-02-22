FROM node:18

WORKDIR /app

COPY package.json yarn.lock /app/
RUN yarn install

COPY . /app/
RUN yarn run build

USER node
EXPOSE 3000

CMD ["node", "build/index.js"]
