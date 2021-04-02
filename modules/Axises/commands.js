const { ENABLE, DIRECTION } = require('../../config/config').AXISES

function _cmdRead(name, cmd) {
    let command = cmd
    if (cmd == undefined)
        command = 'stop'
    const confList = {
        forward: { //go forward
            'Left Front': { en: ENABLE, dir: !DIRECTION },
            'Right Front': { en: ENABLE, dir: DIRECTION },
            'Left Rear': { en: ENABLE, dir: DIRECTION },
            'Right Rear': { en: ENABLE, dir: DIRECTION }
        },
        turnLeft: { //rotate in place to left side 
            'Left Front': { en: ENABLE, dir: DIRECTION },
            'Right Front': { en: !ENABLE, dir: DIRECTION },
            'Left Rear': { en: ENABLE, dir: DIRECTION },
            'Right Rear': { en: !ENABLE, dir: DIRECTION }
        },
        turnRight: { //rotate in place to right side
            'Left Front': { en: !ENABLE, dir: DIRECTION },
            'Right Front': { en: ENABLE, dir: DIRECTION },
            'Left Rear': { en: !ENABLE, dir: DIRECTION },
            'Right Rear': { en: ENABLE, dir: DIRECTION }
        },
        goLeft: { //go forward and to the left 
            'Left Front': { en: ENABLE, dir: !DIRECTION, torsion: false},
            'Right Front': { en: ENABLE, dir: DIRECTION, torsion: false },
            'Left Rear': { en: ENABLE, dir: DIRECTION, torsion: false },
            'Right Rear': { en: ENABLE, dir: DIRECTION, torsion: false }
        },
        goRight: { //go forward and to the right 
            'Left Front': { en: ENABLE, dir: !DIRECTION },
            'Right Front': { en: ENABLE, dir: DIRECTION },
            'Left Rear': { en: ENABLE, dir: DIRECTION },
            'Right Rear': { en: ENABLE, dir: DIRECTION }
        },
        backward: { //go backward
            'Left Front': { en: ENABLE, dir: DIRECTION },
            'Right Front': { en: ENABLE, dir: !DIRECTION },
            'Left Rear': { en: ENABLE, dir: !DIRECTION },
            'Right Rear': { en: ENABLE, dir: !DIRECTION }
        },
        reverseLeft: { //reverse to the left
            'Left Front': { en: ENABLE, dir: !DIRECTION },
            'Right Front': { en: !ENABLE, dir: !DIRECTION },
            'Left Rear': { en: ENABLE, dir: !DIRECTION },
            'Right Rear': { en: !ENABLE, dir: !DIRECTION }
        },
        reverseRight: { //reverse to the right
            'Left Front': { en: !ENABLE, dir: !DIRECTION },
            'Right Front': { en: ENABLE, dir: !DIRECTION },
            'Left Rear': { en: !ENABLE, dir: !DIRECTION },
            'Right Rear': { en: ENABLE, dir: !DIRECTION }
        },
        stop: { //do not move
            'Left Front': { en: !ENABLE, dir: DIRECTION },
            'Right Front': { en: !ENABLE, dir: DIRECTION },
            'Left Rear': { en: !ENABLE, dir: DIRECTION },
            'Right Rear': { en: !ENABLE, dir: DIRECTION }
        }
    }
    return confList[command][name]
}

module.exports = { _cmdRead: _cmdRead }