const config = require('../../config/config').LEARNING
const { readFromFile, writeToFile } = require("../../global/jsonCtrl")
const controller = {
    history:
        [
            [320, 'forward'],//0
            [400, 'forward'],//1
            [500, 'forward'],//2
            [800, 'forward'],//3
            [0, undefined],//4
            [320, 'forward'],//5
            [400, 'forward'],//6
            [0, undefined],//7
            [320, 'forward'],//8
            [400, 'forward'],//9
            [500, 'forward'],//10
            [800, 'forward'],//11
            [1000, 'forward'],//12
            [1600, 'forward'],//13
            [0, undefined]//14
        ]
    ,
    _message: msg => { console.log(msg) },
    goForward: () => { console.log('jedzie do przodu') },
    stop: () => { console.log('stop leci') },
    highestFreq: 10
}
const predkosci = [10, 100, 200, 700, 800, 0, 100, 300, 400, 0, 0, 100, 200, 400, 700, 900, 1000, 1200, 1500, 1600]
var ktoraPredkosc = 0
let interwalTestowy = setInterval(() => {
    controller.highestFreq = predkosci[ktoraPredkosc]
    ktoraPredkosc++
    //console.log(controller.highestFreq, 'freq')
    if (ktoraPredkosc > predkosci.length - 1)
        clearInterval(interwalTestowy)
}, 1000)
const learning = {
    pathName: 'test',
    readData: [],
    active: async (pathName) => {
        try {
            learning.pathName = pathName
            await learning._read()
            await learning._autoDrive()
        }
        catch (error) { controller._message(`Function active() aborted at learning object. ${error.message}.`) }
    },
    _autoDrive: async () => {
        try {
            function sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms))
            }
            async function print(cmd) {
                controller._message(`Autodrive: step ${idx}/${learning.readData.length} at cmd ${cmd}`)
            }
            const asyncInterval = async (callback, ms) => {
                return new Promise((resolve, reject) => {
                    const interval = setInterval(async () => {
                        if (await callback()) {
                            clearInterval(interval)
                            await sleep(1000)
                            resolve()
                        }
                    }, ms)
                })
            }

            console.log('autodrive')
            let idx = 0
            for await (el of learning.readData) {
                idx++
                await learning._cmdToFcn(el[1])
                await print(el[1])
                const condition = async () => { return controller.highestFreq >= el[0] }
                await asyncInterval(condition, 100)
            }
        }
        catch (error) { controller._message(`Function _autoDrive() aborted at learning object. ${error.message}.`) }
    },
    _cmdToFcn: async (cmd) => {
        switch (cmd) {
            case 'forward': controller.goForward(); break
            case 'backward': controller.goBackward(); break
            case 'goLeft': controller.goLeft(); break
            case 'goRight': controller.goRight(); break
            case 'turnLeft': controller.turnLeft(); break
            case 'turnRight': controller.turnRight(); break
            case 'reverseLeft': controller.reverseLeft(); break
            case 'reverseRight': controller.reverseRight(); break
            case 'stop': controller.stop(); break
        }
    },
    save: async () => {
        try {
            await learning._optimaze()
            await writeToFile(config.FOLDER + learning.pathName + '.json', controller.history, controller)
        }
        catch (error) { controller._message(`Function save() aborted at learning object. ${error.message}.`) }
    },
    _read: async () => {
        try {
            learning.readData = await readFromFile(config.FOLDER + learning.pathName + '.json', controller)
            console.table(learning.readData)
        }
        catch (error) { controller._message(`Function _read() aborted at learning object. ${error.message}.`) }
    },
    _optimaze: async () => {
        try {
            controller.history = controller.history.map(el => [el[0], el[1] === undefined ? 'stop' : el[1]])
            controller.history = controller.history.map(
                (el, idx) => el = idx > 0 ?
                    [
                        el[0] === controller.history[idx - 1][0] ? '' : el[0],
                        el[1] === controller.history[idx - 1][1] ? '' : el[1]
                    ] : el
            )
            let startNamedIdx
            controller.history.forEach((el, idx) => {
                if (el[1] === '') { //duplicate cmd
                    removedFreq = el[0]
                    controller.history[startNamedIdx][0] = el[0]
                }
                else startNamedIdx = idx //command with cmd name
            })
            controller.history = controller.history.filter((el) => el[1] !== '')
        }
        catch (error) { controller._message(`Function _optimaze() aborted at learning object. ${error.message}.`) }
    },
    _velToFreq: v => {
        return 7.2 * Math.PI * config.WHEELS_RADIUS / config.HARDWARE_PUL_PER_REV * v
    }
}
//learning.save()
//learning._read()
learning.active('test')
module.exports = learning