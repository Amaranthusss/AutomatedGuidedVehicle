const fs = require('fs')
const fsPromises = require('fs').promises

async function readFromFile(path, Module) {
    const data = await fsPromises.readFile(path)
        .catch((err) => Module._message(`Function readFromFile() aborted at jsonCtrl object. Probably file not found. ${error.message}.`))
    return JSON.parse(data.toString())
}

async function writeToFile(path, data, Module) {
    fs.writeFile(path, JSON.stringify(data), 'utf8', error => {
        if (error)
            Module._message(`Function writeToFile() aborted at jsonCtrl object. ${error.message}.`)
        Module._message('***********Data has been entered to:', path, '**************\n', data)
    })
}
async function getFilesList(folderPath) {
    let filesList = []
    const files = await fsPromises.readdir(folderPath)
    for await (const file of files)
        filesList.push(file)
    return filesList
}

module.exports = {
    readFromFile,
    writeToFile,
    getFilesList
}