const readConfFile = require("./conf/conf")
const MongoDBClient = require("./services/mongoSdk")
const BigMLSdkClient = require("./services/bigMLSdk")
const runKafkaConsumer = require("./handlers/kafkaHandlerConsumer");
const trainBigMl = require("./handlers/bigMLHandler");
const conf = readConfFile()


/* Mongo Db */

const clientBigMl = new BigMLSdkClient(conf.bigmlUserName, conf.bigMLapiKey);
const afterConnect = async (mongoClient) => {
    console.log("Connected to mongo!")
    const trainData = await client.readAllCollectionWithoutId(conf.mongoDataDbName, conf.mongoCollectionNameTrain)
    clientBigMl.connect();
    console.log(`Got ${trainData.length} documents from collection ${conf.mongoCollectionNameTrain}`)
    console.log(`Start training data from collection ${conf.mongoCollectionNameTrain}`)

    try {
        await trainBigMl(clientBigMl, trainData)
    } catch (e) {
        console.log("Got an error in train process" + e)
    }

    runKafkaConsumer(client)

}

const client = new MongoDBClient(conf.mongoDatabaseName, conf.mongoPassword, afterConnect)
client.connect()



const express = require('express')
const app = express()
const port = 8085
const bodyParser = require('body-parser')

app.use(bodyParser.json())

app.get('/predict', async (req, res) => {
    console.log(req.body)
    const value = await clientBigMl.predict(req.body)
    res.send({"section":value})
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
