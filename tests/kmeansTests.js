
//-------k-Means Algorithm-------
const KMeans = require("../scanners/kmeans");
const frontScannerKMeans = KMeans.frontScanner;

//Vector simulation
//distArr = [ 0, 8, 179, 180, 180, 180, 180, 180, 180, 180 ]; //real 1
//distArr = [ 101, 71, 91, 180, 66, 179, 179, 179, 182, 179 ]; //real 2
distArr = [];
for (let i = 0; i < (Math.floor(Math.random() * 10) + 2); i++)
    distArr.push(Math.floor(Math.random() * 190) + 1)
for (let i = 0; i < (Math.floor(Math.random() * 3) + 2); i++)
    distArr.push(Math.floor(Math.random() * 60) + 1)
const test = {
    distances: distArr,
    lowest: 45,
    highest: 190,
    angle: 200,
    sum: 5566
};

async function run() {
    await console.log('_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ ');
    await frontScannerKMeans.start(test);
    await console.log('return\n',frontScannerKMeans.return());
} run();
