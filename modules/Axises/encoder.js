const { showPathsList } = require("../../server/controllers/AutoDriver")

const encoderHandler = ({ upButton, downButton, getPosition }) => {
    let c = 1

    upButton.on('up', () => {
        c++
        getPosition()
    })

    downButton.on('up', () => {
        c--
        getPosition()
    })
    function getPosition() { console.log(c) }
}
module.exports = encoderHandler