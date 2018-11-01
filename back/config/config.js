module.exports = {
    factory: {
        abi: [{"constant":true,"inputs":[],"name":"boxCount","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"authority","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"sender","type":"address"},{"name":"recipient","type":"address"},{"name":"senderEcTag","type":"uint256"},{"name":"fingerprint","type":"uint256"}],"name":"createNewBox","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"authority_","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"},{"indexed":false,"name":"number","type":"uint256"},{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"recipient","type":"address"}],"name":"NewBoxCreatedEvent","type":"event"}],
        address: process.env.BOXFACTORY_ADDRESS || '0x56cd6447398bbb32627a8a7812ef1a69738ef0ed'
    },
    box: {
        abi: [{"constant":true,"inputs":[],"name":"status","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"senderEcTag","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"fingerprint","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_recipientEcTag","type":"uint256"}],"name":"approveOpenRequest","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"recipient","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"sender","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"number","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"openRequest","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"recipientEcTag","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_boxNumber","type":"uint8"},{"name":"_sender","type":"address"},{"name":"_recipient","type":"address"},{"name":"_senderEcTag","type":"uint256"},{"name":"_fingerprint","type":"uint256"},{"name":"_authority","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"status","type":"uint8"},{"indexed":false,"name":"author","type":"address"}],"name":"BoxStatusChangedEvent","type":"event"}]
    },
    authority: {
        address: process.env.AUTHORITY_ADDRESS || '0x8fe368a075446d30448d69433c74f58b71141d23',
        abi: [{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"approveRequest","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"declined","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"approved","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"declineRequest","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"blocked","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"name_","type":"string"},{"name":"alias_","type":"string"}],"name":"register","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"unblockAccount","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"waitingRequests","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"addr","type":"address"}],"name":"account","outputs":[{"name":"name","type":"string"},{"name":"alias","type":"string"},{"name":"status","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"blockAccount","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"addr","type":"address"}],"name":"isAccountActive","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"addr","type":"address"}],"name":"waitingRequestDetails","outputs":[{"name":"name","type":"string"},{"name":"alias","type":"string"},{"name":"status","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"addr","type":"address"}],"name":"NewAddressReg","type":"event"}]
    },
    ipfs: {
        api: process.env.IPFS_RPC_URL || "/ip4/127.0.0.1/tcp/5001"
    },
    eth: {
        api: process.env.ETHEREUM_RPC_URL || 'http://localhost:8545',
        datadir: process.env.ETH_DATADIR || "../docker/static"
    },
    uploadsDir: process.env.UPLOADS_DIR || "/tmp/uploads",
    user: {
        address: '0xb6e0f61fe0afa2306b9746e6da825fcb9924cfdc',
        // address: '0xe66468278347fa6887945c2bc52bf5c6ac90f876',
        passphrase: 'q123'
    }
};

