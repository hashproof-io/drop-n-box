const config = require('../config/config');
const FileForce = require('file-force');
const stream = require("stream");

const multihash = require('multihashes');
const BigNumber = require('bignumber.js');
const multihashConst = require('multihashes/src/constants');
const Signature = require ('elliptic/lib/elliptic/ec/signature');

String.prototype.lpad = function (padString, length) {
    let str = this;
    while (str.length < length)
        str = padString + str;
    return str;
};

class FileForceService extends FileForce {

    constructor() {
        super(config);
        this.ipfs.instance.id()
            .then(function (data) {
                console.info('IPFS connection: success');
            })
            .catch(function (err) {
                if (err.code == 'ECONNREFUSED') {
                    console.info('IPFS connection: failed. Check:', err.address + ':' + err.port);
                    process.exit(-1);
                }
            });
    }

    info() {
        return new Promise((resolve, reject)=> {
            let ipfs = {};
            this.ipfs.instance.id()
                .then(node => {
                    ipfs.id = node.id;
                    return this.ipfs.instance.swarm.peers();
                })
                .then(peers => {
                    ipfs.peers = peers.length;
                    resolve(ipfs);
                })
                .catch(exception => {
                    reject(exception);
                });
        });
    }

    decodeToBN256(hash) {
        let ipfsHashArr = multihash.fromB58String(hash);
        let ipfsHashDec = multihash.decode(ipfsHashArr);
        let ipfsDigest = new BigNumber('0x' + ipfsHashDec.digest.toString('hex'));
        return ipfsDigest;
    }

    bnToMultihash58(hashPartBn, hashAlgorithm = 'sha2-256') {
        let mhCode = multihashConst.names[hashAlgorithm];
        let mhLength = multihashConst.defaultLengths[mhCode];
        let originHex = hashPartBn.toString(16).lpad("0", mhLength * 2).toString();
        let originBuf = Buffer.from(originHex, 'hex');
        let origin = multihash.toB58String(multihash.encode(originBuf, hashAlgorithm));
        return origin;
    }

    stream(ecTagHashBn, account, passphrase) {
        if (!passphrase || !account || !ecTagHashBn) {
            throw new Error('FileForce: Account, passphrase and ipfs hash should be provided');
        } else {
                let selfKeyPair = this.unlockKeys(account, passphrase);
                return this.ecTagByHash(this.bnToMultihash58(ecTagHashBn))
                    .then((ecTag) => {
                        return this.decryptEcTag(ecTag, selfKeyPair);})
                    .then(tag => {
                        let result = {
                            mimeType: tag.metadata.mimeType,
                            filename: encodeURIComponent(tag.metadata.originalName)
                        };
                        result.stream = new stream.PassThrough();
                        result.signature = new Signature({
                            r: tag.signature.r,
                            s: tag.signature.s,
                            recoveryParam: tag.signature.v
                        });
                        this.decryptByTag(tag, result.stream);
                        return result;
                    });

        }
    }

    meta(ecTagHashBn) {
        if (!ecTagHashBn) {
            throw new Error('FileForce: Can not obtain meta information, ecTagHashBn is not provided');
        } else {
            return this.ecTagByHash(this.bnToMultihash58(ecTagHashBn))
                .then(ecTag=>{
                    let meta = {
                        ecTagHash: this.bnToMultihash58(ecTagHashBn),
                        mimeType: ecTag.metadata ? ecTag.metadata.mimeType : 'Unknown type',
                        name: ecTag.metadata ? ecTag.metadata.originalName : 'Unknown name'
                    };
                    return meta;
                });


        }
    }

    upload(data, ownerAccount, ownerPassphrase) {
        return new Promise((resolve, reject) => {
            if (!data || !ownerAccount || !ownerPassphrase) {
                reject('FileForce: All the parameters are required for uploading');
            } else {
                const selfKeyPair = this.unlockKeys(ownerAccount, ownerPassphrase);
                let metadata = {};
                metadata.mimeType = data.mimetype;
                metadata.originalName = data.originalname;
                let result = {};
                this.add(data.path, selfKeyPair, selfKeyPair.publicKey, {metadata: metadata})
                    .then(res => {
                        result.ecTagHashBn = this.decodeToBN256(res.hash);
                        return this.decryptEcTag(res.ecTag, selfKeyPair);
                    }).then(tag=>{
                        result.signature = new Signature({r: tag.signature.r, s: tag.signature.s, recoveryParam: tag.signature.v});
                        resolve(result);
                    }).catch(exception=>{
                        reject(exception);
                    });
            }
        });
    }

    delegate(ecTagHashBn, ownerAccount, ownerPassphrase, delegatePublicKey) {
        return new Promise((resolve, reject) => {
            if (!ecTagHashBn || !ownerAccount || !ownerPassphrase || !delegatePublicKey) {
                reject('FileForce: All the parameters are required for delegation');
            } else {
                console.log('Delegate PK ' + delegatePublicKey);
                const selfKeyPair = this.unlockKeys(ownerAccount, ownerPassphrase);
                let hash = this.bnToMultihash58(ecTagHashBn);
                console.log('FileForce: Delegating hash ' + hash);
                this.delegateTag(hash, selfKeyPair, delegatePublicKey)
                    .then(delegated=> {
                        console.log('FileForce: Hash delegated: to ' + delegated.ecTag.partyAddress + ' Tag: ' + delegated.hash);
                        resolve(this.decodeToBN256(delegated.hash));
                    })
                    .catch(error=> {
                        reject(error)
                    });
            }
        });
    }

    download(ecTagHashBn, account, passphrase) {
        if (!account || !ecTagHashBn) {
            throw new Error('FileForce: Account, passphrase and IPFS hash should be provided');
        } else {
            return new Promise((resolve, reject) => {
                try {
                    let selfKeyPair = this.unlockKeys(account, passphrase);
                    let hash = this.bnToMultihash58(ecTagHashBn);
                    this.ecTagByHash(hash).then((ecTag) => {
                        this.decryptEcTag(ecTag, selfKeyPair).then(tag => {
                            let out = new stream.PassThrough();
                            let result = {};
                            let json = '';
                            result.signature = new Signature({r: tag.signature.r, s: tag.signature.s, recoveryParam: tag.signature.v});
                            this.decryptByTag(tag, out);

                            out.on('data', (chunk) => {
                                json += chunk;
                            });
                            out.on('end', ()=> {
                                result.data = JSON.parse(json);
                                resolve(result);
                            });
                        });
                    }).catch(error=> {
                        reject(error);
                    });
                } catch (error) {
                    reject(error);
                }
            });
        }
    }

    tagWithEncryptedFile(ecTagHashBn, account, passphrase) {
        if (!passphrase || !account || !ecTagHashBn) {
            throw new Error('FileForce: Account, passphrase and ipfs hash should be provided');
        } else {
            let selfKeyPair = this.unlockKeys(account, passphrase);
            return this.ecTagByHash(this.bnToMultihash58(ecTagHashBn))
                .then((ecTag) => {
                    return this.decryptEcTag(ecTag, selfKeyPair);
                })
                .then(tag => {
                    //return tag;
                    return new Promise((resolve, reject) => {
                        try {
                            this.ipfs.cat(tag.ipfs,
                                (error, ipfsStream) => {
                                    if (error) {
                                        console.error(error);
                                        reject(error);
                                    }
                                    resolve({tag:tag, stream:ipfsStream});
                                });
                        } catch (exception) {
                            console.error(exception);
                            reject(exception);
                        }
                    });
                });
        }
    }

}

module.exports = FileForceService;