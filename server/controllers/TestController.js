var data = { name: '', output: { dist: 0, angle: 0 } }

//ToDo: change that to velocity
function sendToSite(req, res) {
    //console.log(data)
    res.send(data)
}

module.exports = {
    sendToSite: sendToSite,
    data: data
}