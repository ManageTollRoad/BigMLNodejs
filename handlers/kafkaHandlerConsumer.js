const KafkaConsumerClient = require("../services/kafkaConsumeSdk")
const readConfFile = require("../conf/conf")
const conf = readConfFile()

const dbName = conf.mongoDataDbName;
const dataCollectionName = conf.mongoCollectionName;
const trainCollectionName = conf.mongoCollectionNameTrain;

module.exports = runKafkaConsumer = (mongoClient) => {
    const afterMongoAction = (err)=>{
        if(err)
            throw err;
    }


    const onData = (data) => {
        console.log(`Got new data from kafka on topic ${conf.dataTopic}! data: ${JSON.stringify(data)}`);
        console.log(`Push data: ${JSON.stringify(data)} to mongodb.`);
        mongoClient.addDataToCollection(dbName,dataCollectionName,data,undefined)

    }

    const onTrain = (data) => {
        console.log(`Got new data from kafka on topic ${conf.trainTopic}! data: ${JSON.stringify(data)}`);
        mongoClient.addDataToCollection(dbName,trainCollectionName,data,afterMongoAction)
    }

    const topicCallback = {}
    topicCallback[conf.dataTopic] = onData;
    topicCallback[conf.trainTopic] = onTrain;


    const kafkaConsumer = new KafkaConsumerClient(
        conf.prefix,
        topicCallback,
        (topics) => console.log(`Consumer connected to kafka!\nListening to topics: [${topics}]`),
        () => console.log("Disconnected from kafka!"),
        (err) => console.log(`Kafka got an error: ${err}`),
        undefined,
        undefined
    )


    kafkaConsumer.connect()

}


