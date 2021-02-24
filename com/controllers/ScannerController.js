var data = { name: '', output: { dist: 0, angle: 0 } }
function get(req, res) {
    console.log(req.body.upvote)
}

function sendToSite(req, res) {
    res.send(data)
}

module.exports = {
    sendToSite: sendToSite,
    get: get,
    data: data
}