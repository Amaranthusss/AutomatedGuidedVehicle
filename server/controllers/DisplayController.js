const controller = require('../../modules/Axises/Axises')

function setFreqDisplay(req, res) {
    res.send({ highestFreq: controller.highestFreq })
}

module.exports = {
    setFreqDisplay: setFreqDisplay,
}