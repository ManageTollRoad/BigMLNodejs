const bigml = require("bigml");

module.exports = class BigMLSdkClient {
    constructor(userName, apiKey) {
        this.userName = userName;
        this.apiKey = apiKey;
        this.connection = undefined;
        this.sourceInfo=undefined;
        this.modelInfo=undefined;
        this.datasetInfo=undefined;

    }


    connect() {
        console.log("Connect to big ml");
        this.connection = new bigml.BigML(this.userName,
            this.apiKey)
        process.env["BIGML_USERNAME"]= "managetollroad"
        process.env["BIGML_API_KEY"]= "9a81049586845a2e4db8ef079327c828eb2ace84"

    }

    async trainBigML(pathToCsvData) {
        const source = new bigml.Source();
        const obj = this;
        return new Promise((resolve, reject) => {
            source.create(pathToCsvData, function (error, sourceInfo) {
                if (!error && sourceInfo) {
                    const dataset = new bigml.Dataset();
                    dataset.create(sourceInfo, function (error, datasetInfo) {
                        if (!error && datasetInfo) {
                            const model = new bigml.Model();
                            model.create(datasetInfo,{},undefined, function (error, modelInfo) {
                                if (!error && modelInfo) {
                                    obj.sourceInfo = sourceInfo;
                                    obj.datasetInfo = datasetInfo;
                                    obj.modelInfo = modelInfo
                                    resolve(obj);
                                } else {
                                    reject(error)
                                }
                            });
                        } else {
                            reject(error);
                        }
                    });
                } else {
                    reject(error);
                }
            });
        });
    }

    async predict(enterObj){
        const prediction = new bigml.Prediction();
        let exitObj = enterObj;
        exitObj["type"]="exit road";
        delete exitObj["section"]
        return new Promise((resolve,reject)=>{
            prediction.create(this.modelInfo, enterObj,undefined,undefined,
            (err,response)=>{
                if(err)
                    reject(err)
                resolve(Math.round(response["object"]["output"]))
            })
        })

    }


}