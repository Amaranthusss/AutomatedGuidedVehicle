const errors = Array(50).fill(5000).map((el, idx) => el + idx)


function hello(obj, printOut) {
    if (printOut == undefined)
        console.log(`[${obj.name}: ${obj.id}] has been initialized`, obj.hardware.pinout)
    else
        console.log(`[${obj.name}: ${obj.id}]`, obj.hardware.pinout, obj.output)
}
function message(obj, msg) {
    console.log(`[${obj.name}: ${obj.id}] ${msg}`)
    return msg
}

module.exports = {
    hello,
    message
}