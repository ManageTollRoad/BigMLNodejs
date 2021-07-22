const fs = require('fs');

module.exports =  readConfFile = ()=>{
    let rawData = fs.readFileSync("conf/conf.json");
    return JSON.parse(rawData)
}
