FROM ubuntu:16.04

LABEL version="1.0"
LABEL maintainer="npronnikov@yandex.ru"

ENV DEBIAN_FRONTEND=noninteractive

# Install necessary dependencies
RUN apt-get update && apt-get install --yes software-properties-common \
    && add-apt-repository ppa:ethereum/ethereum \
    && apt-get update && apt-get install --yes geth \
    && apt-get install --yes git \
    && apt-get install --yes nodejs \
    && apt-get install --yes npm \
    && ln -s /usr/bin/nodejs /usr/bin/node

ADD net/geth.sh /home/run/geth.sh

# Install ethstats client
RUN mkdir /home/ethstat && cd /home/ethstat \
    && git clone https://github.com/cubedro/eth-net-intelligence-api \
    && cd eth-net-intelligence-api \
    && npm install \
    && npm install -g pm2

COPY ethstats/app.json /home/ethstat/eth-net-intelligence-api/

RUN chmod +x /home/run/geth.sh

ENTRYPOINT ["/home/run/geth.sh"]