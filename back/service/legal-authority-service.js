const Tx            = require('ethereumjs-tx');
const Eu            = require('ethereumjs-util');
const cache         = require('memory-cache');

const config = require('../config/config');

const get = (eth, txHash) => {
    return eth.getTransaction(txHash)
};

const getX = (eth, txHash, chainId) => {
    let gethTx = get(eth, txHash);
    // let tx = new Tx({chainId: chainId});
    let tx = new Tx(null);
    tx.nonce = Eu.intToHex(gethTx.nonce);
    tx.gasPrice = Eu.intToHex(gethTx.gasPrice);
    tx.gasLimit = Eu.intToHex(gethTx.gas);
    tx.to = gethTx.to;
    tx.value = Eu.intToHex(gethTx.value);
    tx.data = gethTx.input;
    tx.r = gethTx.r;
    tx.s = gethTx.s;
    tx.v = gethTx.v;
    return tx;
};

class LegalAuthority {

    constructor(web3) {
        this.contract = web3.eth.contract(config.authority.abi).at(config.authority.address);
        this.owner = this.contract.owner();
        this.chainId = web3.version.network;
    }


    approveRequest(account){
        return this.contract.approveRequest.sendTransaction(account, {from: this.owner, gas: 2000000});
    }

    declineRequest(account){
        return this.contract.declineRequest.sendTransaction(account, {from: this.owner, gas: 2000000});
    }

    waitingRequests() {
        let requests = [];
        let addresses = this.contract.waitingRequests();
        addresses.forEach((address, index)=> {
            let data = this.contract.waitingRequestDetails(address);
            requests.push({
                address: address,
                name: data[0],
                alias: data[1]
            });
        });
        return requests;
    }

    register(account, name, alias) {
        if(cache.get(account)) {
            cache.del(account);
        }
        return this.contract.register.sendTransaction(name, alias, {from: account, gas: 3000000});
    }

    accountDetails(address) {
        let account = {};
        account.address = address;
        let data = this.contract.account(address);
        if (data) {
            account.name = data[0] || address;
            account.alias = data[1] || '-';
            account.fullName = data[0] ? (account.name + (data[1]?' ['+ data[1] +']':'')) : address;
            account.status = data[2];
        }
        return account;
    }

    addressToName(address) {
        let name = cache.get(address);
        if(!name || name === address) {
            try {
                let details = this.accountDetails(address);
                name = details.name || 'UNKNOWN ['+address+']';
                cache.put(address, name, 600000);
            } catch (exception){
                name = address;
            }
        }
        return name;
    }

    addressToPublic(address, options = {fromBlock: 0}) {
        let newRegFilter = this.contract.NewAddressReg({addr: address}, options);
        let eth = this.contract._eth;
        return new Promise((resolve, reject) => {
            newRegFilter.get((error, events) => {
                console.log(events);
                if (error) reject(error);
                let length = events.length;
                if (length > 0) {
                    let lastRegEvent = events[length - 1];
                    let txHash = lastRegEvent.transactionHash;
                    let tx = getX(eth, txHash, this.chainId);
                    console.log(tx.getSenderPublicKey());
                    let publicKey = Buffer.concat([Buffer.from('04', 'hex'), tx.getSenderPublicKey()]).toString('hex');
                    resolve(publicKey)
                } else {
                    reject('Transaction for address '+address+' not found.');
                }
            });
        });
    }
}

module.exports = LegalAuthority;
