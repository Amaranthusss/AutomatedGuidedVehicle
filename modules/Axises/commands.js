const { ENABLE, DIRECTION } = require('../../config/config').AXISES

function _cmdRead(name, cmd) {
    let command = cmd
    if (cmd == (undefined || '' || null))
        command = 'stop'
    const confList = {
        forward: {
            'Left Front': { en: ENABLE, dir: !DIRECTION },
            'Right Front': { en: ENABLE, dir: DIRECTION },
            'Left Rear': { en: ENABLE, dir: DIRECTION },
            'Right Rear': { en: ENABLE, dir: DIRECTION }
        },
        turnLeft: {
            'Left Front': { en: ENABLE, dir: DIRECTION },
            'Right Front': { en: !ENABLE, dir: DIRECTION },
            'Left Rear': { en: ENABLE, dir: DIRECTION },
            'Right Rear': { en: !ENABLE, dir: DIRECTION }
        },
        turnRight: {
            'Left Front': { en: !ENABLE, dir: DIRECTION },
            'Right Front': { en: ENABLE, dir: DIRECTION },
            'Left Rear': { en: !ENABLE, dir: DIRECTION },
            'Right Rear': { en: ENABLE, dir: DIRECTION }
        },
        backward: {
            'Left Front': { en: ENABLE, dir: DIRECTION },
            'Right Front': { en: ENABLE, dir: !DIRECTION },
            'Left Rear': { en: ENABLE, dir: !DIRECTION },
            'Right Rear': { en: ENABLE, dir: !DIRECTION }
        },
        reverseLeft: {
            'Left Front': { en: ENABLE, dir: !DIRECTION },
            'Right Front': { en: !ENABLE, dir: !DIRECTION },
            'Left Rear': { en: ENABLE, dir: !DIRECTION },
            'Right Rear': { en: !ENABLE, dir: !DIRECTION }
        },
        reverseRight: {
            'Left Front': { en: !ENABLE, dir: !DIRECTION },
            'Right Front': { en: ENABLE, dir: !DIRECTION },
            'Left Rear': { en: !ENABLE, dir: !DIRECTION },
            'Right Rear': { en: ENABLE, dir: !DIRECTION }
        },
        stop: {
            'Left Front': { en: !ENABLE, dir: DIRECTION },
            'Right Front': { en: !ENABLE, dir: DIRECTION },
            'Left Rear': { en: !ENABLE, dir: DIRECTION },
            'Right Rear': { en: !ENABLE, dir: DIRECTION }
        }
    }
    return confList[command][name]
}

module.exports = { _cmdRead: _cmdRead }