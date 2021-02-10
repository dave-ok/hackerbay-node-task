FROM node:lts-alpine AS BUILD_IMAGE

RUN apk update && apk add curl

RUN curl -sf https://gobinaries.com/tj/node-prune | sh

EXPOSE 5000

USER node

RUN mkdir -p /home/node/app

WORKDIR /home/node/app

COPY . .

RUN npm install --only=prod; \
    npm install --save-dev @babel/core @babel/cli;

RUN npm run build; \
    npm uninstall @babel/core @babel/cli; \
    npm prune --production

RUN /usr/local/bin/node-prune

FROM node:lts-alpine

WORKDIR /home/node/app

# copy from build image
COPY --from=BUILD_IMAGE /home/node/app/build ./build
COPY --from=BUILD_IMAGE /home/node/app/node_modules ./node_modules


CMD [ "npm", "run", "start:built" ]