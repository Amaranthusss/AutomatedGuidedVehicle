const fs = require('fs')
const config = require('../../config/config').LEARNING
const { range } = require('../../Global/math')
//const controller = require("./Axises")
const { readFromFile, writeToFile } = require("../../Global/jsonCtrl")
const controller = {
    history: [],
    _message: msg => { console.log(msg) },
    fakeData: range(0, 20).concat(range(20, 0))
}
for (let i = 0; i < 42; i++)
    controller.history.push([controller.fakeData[i], 'forward'])
const learning = {
    pathName: 'test',
    active: async (pathName) => {
        try {
            learning.pathName = pathName
            await learning._read()
            await learning._autoDrive()
        }
        catch (error) { controller._message(`Function active() aborted at learning object. ${error.message}.`) }
    },
    _autoDrive: async () => {
        try { console.log('autodrive') }
        catch (error) { controller._message(`Function _autoDrive() aborted at learning object. ${error.message}.`) }
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
            await readFromFile(config.FOLDER + learning.pathName)
        }
        catch (error) { controller._message(`Function _read() aborted at learning object. ${error.message}.`) }
    },
    _optimaze: async () => {
        try {
            controller.history = controller.history.map(
                (el, idx) => el = idx > 0 ?
                    [
                        el[0] === controller.history[idx - 1][0] ? null : el[0],
                        el[1] === controller.history[idx - 1][1] ? null : el[1]
                    ] : el
            )
        }
        catch (error) { controller._message(`Function _optimaze() aborted at learning object. ${error.message}.`) }
    },
    _velToFreq: v => {
        return 7.2 * Math.PI * config.WHEELS_RADIUS / config.HARDWARE_PUL_PER_REV * v
    }
}
learning.save()
module.exports = learning