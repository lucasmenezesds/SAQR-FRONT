FROM node:10.18.0-buster

WORKDIR /opt/app

COPY . /opt/app

RUN npm install

CMD ["npm", "start"]