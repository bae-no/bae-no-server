FROM node:18-alpine

RUN npm install -g pnpm

COPY .npmrc package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN npm run build

EXPOSE 3000
CMD [ "node", "dist/apps/app/src/main" ]
