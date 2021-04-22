const config = require('../../config/config').LEARNING
const { ACCELERATION, FREQ_ARRAY } = require('../../config/config').AXISES
const { readFromFile, writeToFile } = require('../../global/jsonCtrl')
const { sleep, equalsArray } = require('../../global/math')
const controller = require('./Axises')
const { states } = require('./controllerStates')

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
            await autoDriver._check()
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
                let lastFreq, lastCmd
                if (lastFreq !== '') lastFreq = el[0]
                if (lastCmd !== '') lastCmd = el[1]
                states.maxSpeed = false //enable maximum velocity - unlimited
                if (controller.highestFreq === lastFreq) { //duplicate, set velocity at idx-1
                    let prevIdx = FREQ_ARRAY.findIndex(elFreqArray => elFreqArray == lastFreq) - 1
                    //console.log('el[0]', el[0], '| highestFreq', controller.highestFreq, '| prevIdx', prevIdx)
                    controller.leftFrontAxis.velocity.freq = FREQ_ARRAY[prevIdx]
                    controller.leftRearAxis.velocity.freq = FREQ_ARRAY[prevIdx]
                    controller.rightFrontAxis.velocity.freq = FREQ_ARRAY[prevIdx]
                    controller.rightRearAxis.velocity.freq = FREQ_ARRAY[prevIdx]
                }
                idx++
                controller._message(`Autodrive: step ${idx}/${autoDriver.readData.length} at cmd ${lastCmd} with ${lastFreq} and next should be ${controller.highestFreq}`)
                await autoDriver._cmdToFcn(lastCmd)
                await sleep(ACCELERATION)
                const condition = async () => { return controller.highestFreq >= lastFreq }
                const conditionStop = async () => { return controller.highestFreq === lastFreq }
                if (lastCmd === 'stop')
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
    _check: async () => {
        try {
            controller.history = controller.history.map(el => [el[0], el[1] === undefined ? 'stop' : el[1]])
        }
        catch (error) { controller._message(`Function _check() aborted at learning object. ${error.message}.`) }
    },
    _optimaze: async () => {
        try {
            console.table(controller.history)
            let lastCmd = ''
            let startIdx = 0
            let toRemoveIds = []
            controller.history.forEach((el, idx) => {
                if (idx > 0) {
                    if (el[1] !== lastCmd) {
                        controller.history[startIdx][0] = controller.history[idx - 1][0]
                        startIdx = idx
                    }
                    if (el[0] !== controller.history[idx - 1][0]) {
                        toRemoveIds.push([startIdx + 1, idx - 1])
                    }
                }
                lastCmd = el[1]
            })
            toRemoveIds.forEach((el, idx) => {
                if (idx > 0 && el[0] === toRemoveIds[idx - 1][0] && el[1] >= toRemoveIds[idx - 1][1]) {
                    toRemoveIds[idx - 1][0] = ''
                    toRemoveIds[idx - 1][1] = ''
                }
            })
            toRemoveIds.forEach((el, idx) => {
                if (el[0] > el[1]) {
                    toRemoveIds[idx][0] = ''
                    toRemoveIds[idx][1] = ''
                }
            })
            toRemoveIds = toRemoveIds.filter((el) => el[1] !== '')
            for (let i = toRemoveIds.length - 1; i >= 0; i--) controller.history.splice(toRemoveIds[i][0], toRemoveIds[i][1] - toRemoveIds[i][0] + 1)
            controller.history = controller.history.map((el, idx) => idx > 0 ? equalsArray(el, controller.history[idx - 1]) ? ['', ''] : el : el)
            console.table(controller.history)
        }
        catch (error) { controller._message(`Function _optimaze() aborted at learning object. ${error.message}.`) }
    },
    _velToFreq: v => {
        return 7.2 * Math.PI * config.WHEELS_RADIUS / config.HARDWARE_PUL_PER_REV * v
    }
}

module.exports = autoDriver