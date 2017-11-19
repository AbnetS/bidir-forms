# Dockerfile for bidir Admin service
FROM node:8.8.1

MAINTAINER Teferi Assefa <teferi.assefa@gmail.com>

ADD . /usr/src/app 

WORKDIR /usr/src/app

RUN npm install

EXPOSE 8090

ENTRYPOINT ["node", "app.js"]

