function inRange(value, conf) {
    if (value < conf.min || value > conf.max) {
        let minMax = value < conf.min ? conf.min : conf.max
        return out = conf.limit === true ? minMax : false
    }
    else
        return out = conf.limit === true ? value : true
}
function hexToRgb(h) {
    return [
        +"0x".concat(h[1], h[2]),
        +"0x".concat(h[3], h[4]),
        +"0x".concat(h[5], h[6])
    ]
}
module.exports = { 
    inRange: inRange,
    hexToRgb: hexToRgb
 }