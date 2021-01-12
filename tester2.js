
//-------k-Means Algorithm-------
const KMeans = require("./kmeans");
const frontScannerKMeans = KMeans.frontScanner;

distArr = [];
for (let i = 0; i < (Math.floor(Math.random() * 2) + 2); i++)
    distArr.push(Math.floor(Math.random() * 190) + 1)
for (let i = 0; i < (Math.floor(Math.random() * 2) + 2); i++)
    distArr.push(Math.floor(Math.random() * 60) + 1)

const test = {
    distances: distArr,
    lowest: 45,
    highest: 190,
    angle: 200,
    sum: 5566
};

async function run() {
    await frontScannerKMeans.start(test)
    await console.log(frontScannerKMeans.return())
} run();