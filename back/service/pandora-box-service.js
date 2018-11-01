const config = require('../config/config');

class PandoraBox {

    constructor(web3, authority) {
        this.factory = web3.eth.contract(config.factory.abi).at(config.factory.address);
        this.box = web3.eth.contract(config.box.abi);
        this.authority = authority;
    }

    newBox(sender, recipient, senderEcTagBn, fingerprint){
        console.log('New Box:', sender, recipient, senderEcTagBn, fingerprint);
        return this.factory.createNewBox.sendTransaction(sender, recipient, senderEcTagBn, fingerprint,
            {from: sender, gas: 4700000});
    }


    newBoxEvents(mine, address){
        let logEvent = this.factory.NewBoxCreatedEvent({}, {fromBlock: 0, toBlock: 'latest'});
        return new Promise((resolve, reject) => {
            logEvent.get((err, events) => {
                if (!err) {
                    let res = events.filter(event => mine ? event.args.recipient == address :  event.args.sender == address).map((event) => {
                        return {
                            block: event.blockNumber,
                            address:event.args.addr,
                            sender: event.args.sender,
                            recipient: event.args.recipient
                        };
                    });
                    resolve(res);
                } else {
                    reject(err);
                }
            });
        });
    }

    boxEcTagHash(contractAddress, callerAddress){
        let contract = this.box.at(contractAddress);
        if(contract.sender() == callerAddress){
            console.log('Requesting sender ecTag');
            return contract.senderEcTag();
        } else if(contract.recipient() == callerAddress){
            console.log('Requesting recipient ecTag');
            return contract.recipientEcTag();
        } else
            throw new Error('Caller address in not a participant of the Box transaction');

    }

    boxStatus(contractAddress){
        let contract = this.box.at(contractAddress);
        return contract.status();
    }


    openRequest(contractAddress, callerAddress){
        let contract = this.box.at(contractAddress);
        return new Promise((resolve, reject)=>{
            try{
                let tx = contract.openRequest.sendTransaction({from: callerAddress, gas: 3000000});
                resolve(tx);
            } catch (e){
                reject(e);
            }
        });
    }

    senderEcTag(contractAddress){
        return new Promise((resolve, reject)=>{
            try{
                let contract = this.box.at(contractAddress);
                resolve(contract.senderEcTag());
            } catch (e){
                reject(e);
            }
        });

    }

    recipientPublicKey(contractAddress){
        let contract = this.box.at(contractAddress);
        let recipient = contract.recipient();
        return this.authority.addressToPublic(recipient);
    }

    approveOpenRequest(contractAddress, recipientEcTagBn, callerAddress) {
        let contract = this.box.at(contractAddress);
        console.log('Approving request ' + contract.status());
        return contract.approveOpenRequest.sendTransaction(recipientEcTagBn, {from: callerAddress, gas: 3000000});
    }

}

module.exports = PandoraBox;
