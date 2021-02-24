import { scanners } from './js/scanners.js'
// const scanners = {
//     Rear: { distances: [], angles: [] },
//     Front: { distances: [], angles: [] },
// }
setInterval(() => {
    fetch('/frontScanner').then(e => e.json()).then(obj => {
        //console.log('frontScanner', obj)
        function doubled(scannerSome) {
            if (obj.output.angle != scannerSome.angles[scannerSome.angles.length - 1]) {
                scannerSome.distances.push(obj.output.dist)
                scannerSome.angles.push(obj.output.angle)
                document.getElementById("console1").innerHTML = JSON.stringify(scannerSome.distances);
                document.getElementById("console2").innerHTML = JSON.stringify(scannerSome.angles);
            }
        }
        switch (obj.name) {
            case 'Rear':
                doubled(scanners.Rear)
                break
            case 'Front':
                doubled(scanners.Front)
                break
        }
    })
}, 50)

