const config = require('../../config/config').LEARNING
const { ACCELERATION } = require('../../config/config').AXISES
const { readFromFile, writeToFile } = require('../../global/jsonCtrl')
const { sleep } = require('../../global/math')
const controller = require('./Axises')
const autoDriver = {
    readData: [],
    interval: null,
    active: async pathName => {
        try {
            await autoDriver._read(pathName)
            await autoDriver._autoDrive()
            clearInterval(autoDriver.interval)
        }
        catch (error) { controller._message(`Function active() aborted at autoDriver object (learning.js). ${error.message}.`) }
    },
    save: async pathName => {
        try {
            await autoDriver._optimaze()
            await writeToFile(config.FOLDER + '/' + pathName + '.json', controller.history, controller)
            await controller.pathHasBeenSaved()
        }
        catch (error) { controller._message(`Function save() aborted at autoDriver object (learning.js). ${error.message}.`) }
    },
    _resumeDrive: async () => { },
    _autoDrive: async () => {
        try {
            const asyncInterval = async (callback, ms) => {
                return new Promise((resolve, reject) => {
                    const interval = setInterval(async () => {
                        if (await callback()) {
                            clearInterval(interval)
                            await sleep(100)
                            resolve()
                        }
                    }, ms)
                })
            }
            let idx = 0
            for await (el of autoDriver.readData) {
                idx++
                controller._message(`Autodrive: step ${idx}/${autoDriver.readData.length} at cmd ${el[1]}`)
                await autoDriver._cmdToFcn(el[1])
                const condition = async () => { return controller.highestFreq >= el[0] }
                const conditionStop = async () => { return controller.highestFreq === el[0] }
                if (el[1] === 'stop')
                    await asyncInterval(conditionStop, 100)
                else
                    await asyncInterval(condition, 100)
            }
        }
        catch (error) { controller._message(`Function _autoDrive() aborted at autoDriver object (learning.js). ${error.message}.`) }
    },
    _cmdToFcn: async (cmd) => {
        clearInterval(autoDriver.interval)
        autoDriver.interval = setInterval(() => {
            function callCmdFcn() {
                switch (cmd) {
                    case 'forward': return controller.goForward(true)
                    case 'backward': return controller.goBackward(true)
                    case 'goLeft': return controller.goLeft(true)
                    case 'goRight': return controller.goRight(true)
                    case 'turnLeft': return controller.turnLeft(true)
                    case 'turnRight': return controller.turnRight(true)
                    case 'reverseLeft': return controller.reverseLeft(true)
                    case 'reverseRight': return controller.reverseRight(true)
                    default: return controller.stop(true)
                }
            }
            callCmdFcn()
        }, ACCELERATION)
    },
    _read: async pathName => {
        try {
            autoDriver.readData = await readFromFile(config.FOLDER + '/' + pathName, controller)
            console.table(autoDriver.readData)
        }
        catch (error) { controller._message(`Function _read() aborted at autoDriver object (learning.js). ${error.message}.`) }
    },
    _optimaze: async () => {
        try { //ToDo: SPRAWDZIC CO JEST NIE TAK DLA POWTORZEN - PRZY 8K POWTORZONYM ODRZUCA - PRZEMYSLEC TO
            console.table(controller.history)
            controller.history = controller.history.map(el => [el[0], el[1] === undefined ? 'stop' : el[1]])
            controller.history = controller.history.map( //mark duplicates
                (el, idx) => el = idx > 0 ?
                    [
                        el[0] === controller.history[idx - 1][0] ? 0 : el[0],
                        el[1] === controller.history[idx - 1][1] ? '' : el[1]
                    ] : el
            )
            let startNamedIdx
            controller.history.forEach((el, idx) => { //remove marked duplicates
                if (el[1] === '') { //duplicate cmd
                    removedFreq = el[0]
                    controller.history[startNamedIdx][0] = el[0]
                }
                else startNamedIdx = idx //command with cmd name
            })
            controller.history = controller.history.filter((el) => el[1] !== '')
            console.table(controller.history)
        }
        catch (error) { controller._message(`Function _optimaze() aborted at learning object. ${error.message}.`) }
    },
    _velToFreq: v => {
        return 7.2 * Math.PI * config.WHEELS_RADIUS / config.HARDWARE_PUL_PER_REV * v
    }
}

module.exports = autoDriver