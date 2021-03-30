const fs = require('fs')

async function readFromFile(path, Module) {
    let out = {}
    if (fs.existsSync(path)) {
        fs.readFile(path, (error, data) => {
            if (error)
                Module._message(`Function readFromFile() aborted at jsonCtrl object. ${error.message}.`)
            out = JSON.parse(data)
            console.log('***********Data read from:', path, '**************\n', out)
        })
    } else
        Module._message(`File has not been found at ${path}. Function readFromFile() aborted at jsonCtrl object. ${error.message}.`)
    return out
}

async function writeToFile(path, data, Module) {
    fs.writeFile(path, JSON.stringify(data), 'utf8', error => {
        if (error)
            Module._message(`Function writeToFile() aborted at jsonCtrl object. ${error.message}.`)
        console.log('***********Data has been entered to:', path, '**************\n', data)
    })
}

module.exports = {
    readFromFile: readFromFile,
    writeToFile: writeToFile
}