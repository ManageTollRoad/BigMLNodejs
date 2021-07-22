const readConfFile = require("../conf/conf")
const MongoDBClient = require("../services/mongoSdk")
const runKafkaConsumer = require("./kafkaHandlerConsumer");
const conf = readConfFile()


/* Mongo Db */


const afterConnect = (err) => {
    if (err)
        return console.log(`Connection to mongo failed. Err: ${err}`)
    console.log("Connected to mongo!")
    runKafkaConsumer(client)

}

const client = new MongoDBClient(conf.mongoDatabaseName, conf.mongoPassword, afterConnect)
client.connect()
