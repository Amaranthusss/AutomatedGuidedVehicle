const autoDriver = require('../../modules/Axises/learning')
const controller = require('../../modules/Axises/Axises')
const { getFilesList } = require('../../global/jsonCtrl')
const path = require('path')
const pathsFolder = path.join(__dirname, '../../', '/paths')



function savePath(req, res) {
    autoDriver.save(req.body.pathName)
    res.end('Post done')
}
async function showPathsList(req, res) {
    let pathsList = await getFilesList(pathsFolder)
    await res.send({ pathsList: pathsList })
}
function activePath(req, res) {
    autoDriver.active(req.body.activatedPath)
    res.end('Post done')
}
function dropPathData(req, res) {
    controller.history = []
    controller._message(`Data about current path has been droped. Current history data: ${controller.history}`)
    res.end('Post done')
}

module.exports = {
    savePath,
    showPathsList,
    activePath,
    dropPathData
}