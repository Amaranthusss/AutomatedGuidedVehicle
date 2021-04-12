const autoDriver = require('../../modules/Axises/learning')

function savePath(req, res) {
    autoDriver.save(req.body.state)
    res.end('Post done')
}
function showPathsList(req, res) {
    res.send(data)
}
function activePath(req, res) {
    autoDriver.save(req.body.state)
    res.end('Post done')
}

module.exports = {
    savePath,
    showPathsList,
    activePath
}