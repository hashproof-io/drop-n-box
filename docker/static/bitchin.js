var mining_threads = 1;

function checkWork() {
    if (eth.pendingTransactions.length > 0) {
        if (eth.mining) return;
        console.log("== Pending transactions! Mining...");
        miner.start(1);
        admin.sleepBlocks(5);
        miner.stop();
    } else {
        miner.stop();
        console.log("== No transactions! Mining stopped.");
    }
}

eth.filter("latest", function(err, block) { checkWork(); });
eth.filter("pending", function(err, block) { checkWork(); });

console.log('miner check loaded');

//
// function mine() {
//     if (eth.mining) return;
//     console.log("Mining...");
//     miner.start(1);
//     admin.sleepBlocks(5);
//     miner.stop();
// }
//
// setInterval(function() {
//     mine();
// }, 150000);
//
// mine();
// console.log('Interval miner loaded');
