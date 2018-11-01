FROM node:8

LABEL version="1.0"
LABEL maintainer="npronnikov@yandex.ru"

ENV DEBIAN_FRONTEND=noninteractive

RUN git clone https://github.com/cubedro/eth-netstats

WORKDIR /eth-netstats

RUN npm install
RUN npm install -g grunt-cli
RUN grunt

EXPOSE 3000

CMD ["npm", "start"]
