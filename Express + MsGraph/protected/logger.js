const fs = require("fs");

class Logger {

    step = undefined;
    fileName = undefined;
    noPrint = false;

    constructor(fileName, noPrint = false) {
        this.step = 0;
        this.fileName = fileName;
        this.noPrint = noPrint;
        let startText = `${"*".repeat(100)}\nWORK STARTED: { ${Date().toString()} }`
        fs.appendFileSync(this.fileName, startText + '\n');
        console.log(startText);
    }

    logIt(id, callback) {
        let base = this;
        return async (req, res) => {
            base.step ++;
            let returned = await callback(req, res);
            let logText = `${base.step}. { ${Date().toString()} } [ ${returned} ] < ${id} >`;
            fs.appendFileSync(base.fileName, logText + '\n');
            if (!base.noPrint) {
                console.log('LOG: ' + logText);
            }
        }
    }

    logHere(id) {
        this.step ++;
        let logText = `${this.step}. { ${Date().toString()} } < ${id} >`
        fs.appendFileSync(this.fileName, logText + '\n');
        if (!this.noPrint) {
            console.log('LOG: ' + logText);
        }
    }
}

module.exports = {Logger}