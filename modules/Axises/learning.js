const config = require('../../config/config').LEARNING
const { readFromFile, writeToFile } = require('../../global/jsonCtrl')
const { sleep } = require('../../global/math')
const controller = require('./Axises')
const learning = {
    pathName: 'empty',
    readData: [],
    active: async (pathName) => {
        try {
            learning.pathName = pathName
            await learning._read()
            await learning._autoDrive()
        }
        catch (error) { controller._message(`Function active() aborted at learning object. ${error.message}.`) }
    },
    _resumeDrive: async () => { },
    _autoDrive: async () => {
        try {
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
            let idx = 0
            for await (el of learning.readData) {
                idx++
                await learning._cmdToFcn(el[1])
                controller._message(`Autodrive: step ${idx}/${learning.readData.length} at cmd ${el[1]}`)
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
module.exports = learning