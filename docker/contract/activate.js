personal.unlockAccount(eth.coinbase, 'q123');
personal.unlockAccount(eth.accounts[1], 'q123');
legalauthority.register.sendTransaction('Account 1', 'A1', {from:eth.accounts[0], gas: 4500000});
legalauthority.register.sendTransaction('Account 2', 'A2', {from:eth.accounts[1], gas: 4500000});

legalauthority.approveRequest.sendTransaction(eth.accounts[1], {from: eth.coinbase, gas:4700000});