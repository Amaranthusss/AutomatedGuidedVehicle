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
function range(start, stop) {
    return start > stop ?
        new Array(start + 1).fill(start).map((e, i) => e -= i)
        : new Array(stop - start + 1).fill(start).map((e, i) => e += i)
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}
module.exports = {
    inRange: inRange,
    hexToRgb: hexToRgb,
    range: range,
    sleep: sleep
}