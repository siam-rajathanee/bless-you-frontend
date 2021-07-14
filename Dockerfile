FROM node:15.13.0-alpine as builder

WORKDIR /usr/src/app
COPY . .

RUN yarn install

RUN yarn build

FROM builder as production

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/.nuxt .
COPY --from=builder /usr/src/app/node_modules .
COPY --from=builder /usr/src/app/package.json .

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

CMD [ "npm", "start" ]
