const axises = require('../../modules/Axises/Axises')
function getForwardCmd(req, res) {
    if (req.body.state === true)
        console.log('jedz do przodu')
    else
        console.log('zatrzymaj sie z jazdy w przod')
    res.end('Post done')
}
function getBackwardCmd(req, res) {
    if (req.body.state === true)
        console.log('jedz do tylu')
    else
        console.log('zatrzymaj sie z jazdy do tylu')
    res.end('Post done')
}
function getLeftCmd(req, res) {
    if (req.body.state === true)
        console.log('jedz w lewo')
    else
        console.log('zatrzymaj sie z jazdy w lewo')
    res.end('Post done')
}
function getRightCmd(req, res) {
    if (req.body.state === true)
        console.log('jedz w prawo')
    else
        console.log('zatrzymaj sie z jazdy w prawo')
    res.end('Post done')
}
const controls = {
    
    //let cooling = Object.entries(this.coolerStates).find(el => el[1] == true)
}

module.exports = {
    getForwardCmd: getForwardCmd,
    getBackwardCmd: getBackwardCmd,
    getLeftCmd: getLeftCmd,
    getRightCmd: getRightCmd
}