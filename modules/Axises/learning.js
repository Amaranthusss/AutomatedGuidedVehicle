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
    stop: () => { console.log('stop leci') }
}
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
        try {
            console.log('autodrive')
            controller.history
        }
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
            console.log(await readFromFile(config.FOLDER + learning.pathName + '.json', controller))
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
            console.table(controller.history)
        }
        catch (error) { controller._message(`Function _optimaze() aborted at learning object. ${error.message}.`) }
    },
    _velToFreq: v => {
        return 7.2 * Math.PI * config.WHEELS_RADIUS / config.HARDWARE_PUL_PER_REV * v
    }
}
learning.save()
//learning._read()
module.exports = learning