FROM node:20.12.2-alpine as development

#RUN apk update && apk upgrade
RUN apk add --no-cache python3 make g++

WORKDIR /usr/src/app

COPY ./package.json ./
COPY ./pnpm-lock.yaml ./
COPY ./tsconfig.json ./tsconfig.json

RUN npm install -g pnpm

RUN pnpm install

COPY . .

RUN pnpm run build

FROM node:20.12.2-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

# Only copy necessary files from the development stage
COPY --from=development /usr/src/app/package.json ./
COPY --from=development /usr/src/app/pnpm-lock.yaml ./
COPY --from=development /usr/src/app/.next ./.next
COPY --from=development /usr/src/app/public ./public

RUN npm install -g pnpm
RUN pnpm install --prod

# Non-root user for better security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

CMD ["pnpm","start"]