const config = require('../config/config');
const LegalAuthority = require('./legal-authority-service');
const FileForceService = require('./file-force-service');
const PandoraBoxService = require('./pandora-box-service');
const Web3 = require("web3");
const BigNumber = require('bignumber.js');
const crypto = require('crypto');

class ApplicationService {

    constructor() {
        this.web3 = new Web3();
        //setup web3
        this.web3.setProvider(new this.web3.providers.HttpProvider(config.eth.api));
        if (this.web3.isConnected()) {
            console.info('Web3 connection: success');
            this.web3.reset();
            console.info('Web3 reset done');
            this.authority = new LegalAuthority(this.web3);
            this.fileForce = new FileForceService();
            this.pandoraBox = new PandoraBoxService(this.web3, this.authority)
        } else {
            console.info('Web3 connection: failed. Check:', config.eth.api);
            process.exit(-1);
        }
    }

    unlock() {
        this.web3.personal.unlockAccount(config.user.address, config.user.passphrase);
    }

    setDefaultAccount(address, pwd) {
        config.user.address = address;
        config.user.passphrase = pwd;
    }

    getDefaultAccount() {
        return this.addressDetails(config.user.address)
    }

    addressToName(address) {
        return this.authority.addressToName(address);
    }

    addressDetails(address) {
        return this.authority.accountDetails(address);
    }

    allAccounts() {
        return this.web3.eth.accounts.map(addr => this.authority.accountDetails(addr));
    }

    configuration() {
        let configuration = {};
        return this.fileForce.info()
            .then(
                ipfs => {
                    configuration.ipfs = ipfs;
                    let node = {};
                    node.name = this.web3.version.node;
                    node.network = this.web3.version.network;
                    node.peers = this.web3.net.peerCount;
                    node.mining = this.web3.eth.mining;
                    configuration.node = node;
                    let network = {};
                    network.currentBlock = this.web3.eth.blockNumber;
                    network.gasPrice = this.web3.eth.gasPrice;
                    configuration.network = network;
                    return configuration;
                });
    }

    uploadFile(file, recipient) {
        this.unlock();
        return this.fileForce.upload(file, config.user.address, config.user.passphrase)
            .then(result => {
                let fingerprint = new BigNumber(crypto.createHash('sha256').update(new Buffer(result.signature.toDER())).digest('hex'), 16);
                return this.pandoraBox.newBox(config.user.address, recipient, result.ecTagHashBn, fingerprint);
            });
    }

    // TODO should be config account address
    newBoxEvents(mine) {
        return this.pandoraBox.newBoxEvents(mine, config.user.address)
            .then(events=>{
                for(let i=0;i<events.length;i++){
                    events[i].status = this.pandoraBox.boxStatus(events[i].address);
                }
                return events;
            });
    }

    downloadBox(boxAddress) {
        let ecTagHashBn = this.pandoraBox.boxEcTagHash(boxAddress, config.user.address);
        console.log('Downloadig ' + ecTagHashBn);
        return this.fileForce.stream(ecTagHashBn, config.user.address, config.user.passphrase);
    }

    openRequest(boxAddress) {
        this.unlock();
        return this.pandoraBox.openRequest(boxAddress, config.user.address);
    }

    approveOpenRequest(boxAddress) {
        let recipientPublicKeyPromise = this.pandoraBox.recipientPublicKey(boxAddress);
        let senderEcTagBnPromise = this.pandoraBox.senderEcTag(boxAddress);
        return Promise.all([recipientPublicKeyPromise, senderEcTagBnPromise])
            .then(res=>{
                let recipientPublicKey = res[0];
                let senderEcTagBn = res[1];
                return this.fileForce.delegate(senderEcTagBn, config.user.address, config.user.passphrase, recipientPublicKey)
            }).then(recipientEcTagBn=>{
                console.log('Delegated ' + recipientEcTagBn);
                this.unlock();
                return this.pandoraBox.approveOpenRequest(boxAddress, recipientEcTagBn, config.user.address);
            });
    }




}

module.exports = ApplicationService;
