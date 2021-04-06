const fs = require('fs')

async function readFromFile(path, Module) {
    const fsPromises = require('fs').promises
    const data = await fsPromises.readFile(path)
        .catch((err) => Module._message(`Function readFromFile() aborted at jsonCtrl object. Probably file not found. ${error.message}.`))
    return JSON.parse(data.toString())
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