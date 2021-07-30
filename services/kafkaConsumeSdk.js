// https://www.cloudkarafka.com/ הפעלת קפקא במסגרת ספק זה

const uuid = require("uuid");
const Kafka = require("node-rdkafka");
const StringDecoder = require('string_decoder').StringDecoder;

module.exports = class KafkaConsumerClient {
    constructor(prefix,topicsToSubscribeCallback, onConnect,onDisconnected, onErr, onEventErr, onEventLog) {
        if (topicsToSubscribeCallback == undefined)
            throw new Error("Cannot subscribe to null")

        this.kafkaConf = {
            "group.id": "cloudkarafka-example",
            "metadata.broker.list":
                "glider-01.srvs.cloudkafka.com:9094,glider-02.srvs.cloudkafka.com:9094,glider-03.srvs.cloudkafka.com:9094".split(
                    ","
                ),
            "socket.keepalive.enable": true,
            "security.protocol": "SASL_SSL",
            "sasl.mechanisms": "SCRAM-SHA-256",
            "sasl.username": "baepvu3o",
            "sasl.password": "L3EvyRzOQ5JWqIGwcAON0pC0U133bpdH",
            debug: "generic,broker,security",
        };

        this.prefix = prefix;

        this.consumer = new Kafka.KafkaConsumer(this.kafkaConf, {
            "auto.offset.reset": "beginning",
        });

        this.topics = Object.keys(topicsToSubscribeCallback).map(t => `${this.prefix}${t}`)
        this.topicCallbacks = topicsToSubscribeCallback;
        this.onConnect = onConnect;
        this.onDisconnected = onDisconnected;
        this.onEventErr = onEventErr;
        this.onEventLog = onEventLog;
        this.onErr = onErr;

        this.init();

    }

    init() {
        const obj = this;

        this.consumer.on("ready", function (arg) {
            obj.consumer.subscribe(obj.topics);
            obj.consumer.consume();
            obj.onConnect(obj.topics)
            console.log(arg)
        });



        this.consumer.on("data", function (m) {
            console.log(m)
            const topic = m.topic.split("-")[1]
            const data = JSON.parse(m.value)
            const callback = obj.topicCallbacks[topic];
            if(callback==undefined)
                throw Error(`No callback for topic: ${topic}`)
            callback(data)
        });

        this.consumer.on("disconnected", function (arg) {
            obj.onDisconnected();
            process.exit();
        });

        if (this.onEventErr) {
            this.consumer.on("event.error", function (err) {
                obj.onEventErr();
                process.exit(1);
            });
        }

        if (this.onEventLog) {
            this.consumer.on("event.log", function (log) {
                obj.onEventLog(log);
            });
        }

    }

    connect() {
        this.consumer.connect();
    }
}
