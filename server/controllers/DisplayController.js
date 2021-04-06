const freq = require('../../modules/Axises/Axises').highestFreq

function setFreqDisplay(req, res) {
    res.send({ highestFreq: freq })
}

module.exports = {
    setFreqDisplay: setFreqDisplay,
}