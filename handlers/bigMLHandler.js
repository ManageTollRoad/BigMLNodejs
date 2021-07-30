const BigMLSdkClient = require("../services/bigMLSdk")
const readConfFile = require("../conf/conf")
const setToCsv = require("../services/csvSdk");
const fs = require('fs');
const conf = readConfFile()


module.exports=  trainBigMl = async (client,collectionOfData)=>{
    const csvContent = setToCsv(collectionOfData);
    fs.writeFileSync(conf.csvTrainData, csvContent);
    await client.trainBigML(conf.csvTrainData)

}
