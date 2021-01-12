/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

const internal = {};
const fs = require('fs');

var out; 
module.exports = internal.JsonCtrl = class {
    constructor() {
    }
    
    getFilesData()
    {
        return out;
    }

    readFromFile(path)
    {
        if (fs.existsSync(path)) {
            fs.readFile(path, (err, data) => {
                if (err)
                    throw err;
                out = JSON.parse(data);
                console.log("***********Data read from: " + path + "**************");
                console.log(out);
            });
            this.done = function ()
            {
                if (id != 0 && id != null)
                    enable[id] = true;
            };
        } else
        {
            console.log("***********File has not been found**************");
            console.log(path);
            console.log("***************************************");
        }
    }

    writeToFile(path, data)
    {
        var jsonObj = JSON.parse(data);
        var jsonContent = JSON.stringify(jsonObj);
        fs.writeFile(path, jsonContent, 'utf8', function (err) {
            if (err)
                return console.error(err);
        });
        console.log("***********Data has been entered to: " + path + "**************");
        console.log(data);
        console.log("****************************************************************\n");

    }
}