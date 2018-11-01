# Contract folder 
This folder will be mapped into the container /home directory - see docker-compose.yml for more details

#Compiler
Online Solidity compiler  - http://remix.ethereum.org

#Bash within the container
docker exec -it 87ff143884d3 bash

#Registration
personal.unlockAccount(eth.coinbase, 'q123');
personal.unlockAccount(eth.account[1], 'q123');
legalauthority.register.sendTransaction('Account 1', 'A1', {from:eth.accounts[1], gas: 4500000})
legalauthority.approveRequest.sendTransaction(eth.accounts[1], {from: eth.coinbase, gas:4700000});
