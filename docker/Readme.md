# Docker test network

Docker test network based on ubuntu image + Ethereum network statistic.

# Build

`sudo docker-compose build`

# Run & stop

`sudo docker-compose up -d`
`sudo docker-compose down`

Attach to the console of bootnode (https://github.com/ethereum/go-ethereum/wiki/Private-network)

`sudo docker exec -it bootnode geth attach http://localhost:8545`