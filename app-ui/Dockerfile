FROM node:16
WORKDIR /usr/src/app/app-ui

ENV PORT 8080
ENV HOST 0.0.0.0

COPY package*.json ./

RUN npm install -g @angular/cli @angular-devkit/build-angular && npm install

COPY . .

RUN ng build

COPY . .

CMD ["node", "server.js"]
