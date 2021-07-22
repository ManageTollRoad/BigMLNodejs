const KafkaConsumerClient = require("../services/kafkaConsumeSdk")
const readConfFile = require("../conf/conf")
const conf = readConfFile()

const dbName = conf.mongoDataDbName;
const dataCollectionName = conf.mongoCollectionName;

module.exports = runKafkaConsumer = (mongoClient) => {
    const afterMongoAction = (err)=>{
        if(err)
            throw err;
    }


    const onData = (data) => {
        console.log(`Got new data from kafka! data: ${JSON.stringify(data)}`);
        mongoClient.addDataToCollection(dbName,dataCollectionName,data,afterMongoAction)
    }


    const kafkaConsumer = new KafkaConsumerClient(
        conf.prefix,
        [conf.dataTopic],
        (topics) => console.log(`Consumer connected to kafka!\nListening to topics: [${topics}]`),
        onData,
        () => console.log("Disconnected from kafka!"),
        (err) => console.log(`Kafka got an error: ${err}`),
        undefined,
        undefined
    )


    kafkaConsumer.connect()

}


