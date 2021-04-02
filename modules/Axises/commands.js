const { ENABLE, DIRECTION } = require('../../config/config').AXISES

function _cmdRead(name, cmd) {
    let command = cmd
    if ([undefined, null].some(e => e === cmd))
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
            'Right Front': { en: ENABLE, dir: DIRECTION },
            'Left Rear': { en: ENABLE, dir: !DIRECTION },
            'Right Rear': { en: ENABLE, dir: DIRECTION }
        },
        turnRight: { //rotate in place to right side
            'Left Front': { en: ENABLE, dir: !DIRECTION },
            'Right Front': { en: ENABLE, dir: !DIRECTION },
            'Left Rear': { en: ENABLE, dir: DIRECTION },
            'Right Rear': { en: ENABLE, dir: !DIRECTION }
        },
        goLeft: { //go forward and to the left 
            'Left Front': { en: ENABLE, dir: !DIRECTION, torsion: false },
            'Right Front': { en: ENABLE, dir: DIRECTION, torsion: true },
            'Left Rear': { en: ENABLE, dir: DIRECTION, torsion: true },
            'Right Rear': { en: ENABLE, dir: DIRECTION, torsion: false }
        },
        goRight: { //go forward and to the right 
            'Left Front': { en: ENABLE, dir: !DIRECTION, torsion: true },
            'Right Front': { en: ENABLE, dir: DIRECTION, torsion: false },
            'Left Rear': { en: ENABLE, dir: DIRECTION, torsion: false },
            'Right Rear': { en: ENABLE, dir: DIRECTION, torsion: true }
        },
        backward: { //go backward
            'Left Front': { en: ENABLE, dir: DIRECTION },
            'Right Front': { en: ENABLE, dir: !DIRECTION },
            'Left Rear': { en: ENABLE, dir: !DIRECTION },
            'Right Rear': { en: ENABLE, dir: !DIRECTION }
        },
        reverseLeft: { //reverse to the left
            'Left Front': { en: ENABLE, dir: !DIRECTION, torsion: false },
            'Right Front': { en: ENABLE, dir: !DIRECTION, torsion: true },
            'Left Rear': { en: ENABLE, dir: !DIRECTION, torsion: true },
            'Right Rear': { en: ENABLE, dir: !DIRECTION, torsion: false }
        },
        reverseRight: { //reverse to the right
            'Left Front': { en: ENABLE, dir: !DIRECTION, torsion: true },
            'Right Front': { en: ENABLE, dir: !DIRECTION, torsion: false },
            'Left Rear': { en: ENABLE, dir: !DIRECTION, torsion: false },
            'Right Rear': { en: ENABLE, dir: !DIRECTION, torsion: true }
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