FROM node:18-alpine3.16 as compile
WORKDIR /usr/app
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm clean-install
COPY .. ./
RUN npx next build

FROM node:18-alpine3.16 as stripped
WORKDIR /usr/app
COPY --from=compile /usr/app/package*.json ./
COPY --from=compile /usr/app/next.config.js ./
COPY --from=compile /usr/app/.env* ./
COPY --from=compile /usr/app/.next ./.next
COPY --from=compile /usr/app/public ./public
RUN npm clean-install --omit=dev --ignore-scripts

FROM gcr.io/distroless/nodejs18-debian11
WORKDIR /usr/app
COPY --from=stripped /usr/app ./
CMD ["/usr/app/node_modules/.bin/next", "start"]
