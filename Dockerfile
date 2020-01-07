FROM node:10.18.0-buster

ENV APP_DIR=/opt/app/

WORKDIR $APP_DIR

COPY package* $APP_DIR
RUN npm install

COPY . $APP_DIR

CMD ["npm", "start"]
