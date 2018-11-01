#!/bin/bash
echo "Starting monitoring..."
cd /home/ethstat/eth-net-intelligence-api
sed -i "s/hostname/$HOSTNAME/g" app.json
pm2 start ./app.json
sleep 5

if [ ! -d /home/net/geth ]; then
    echo "First run, init netowrok...."
    geth --datadir=/home/net init "/home/data/genesis.json"
    sleep 5
fi
echo "Staring geth node..."
NODE_IP=`getent hosts bootnode | cut -d" " -f1`
GETH_OPTS=${@/BOOTNODE_IP/$NODE_IP}
echo "Geth options are: $GETH_OPTS"
geth $GETH_OPTS
