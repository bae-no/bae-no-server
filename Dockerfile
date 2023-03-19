FROM node:18-alpine

RUN mkdir -p /app
WORKDIR /app

COPY .npmrc package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

COPY ./apps ./apps
COPY ./libs ./libs
COPY ./prisma ./prisma
COPY ./schema ./schema
COPY ./nest-cli.json ./
COPY ./tsconfig.json ./
COPY ./tsconfig.build.json ./
RUN npm run build

# add new user
RUN adduser -D nonroot \
        && mkdir -p /etc/sudoers.d \
        && echo "$USER ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers.d/nonroot \
        && chmod 0440 /etc/sudoers.d/nonroot

USER nonroot

EXPOSE 3000
CMD [ "node", "dist/apps/app/src/main" ]
