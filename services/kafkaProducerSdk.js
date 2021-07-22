// https://www.cloudkarafka.com/ הפעלת קפקא במסגרת ספק זה

const uuid = require("uuid");
const Kafka = require("node-rdkafka");


module.exports = class KafkaProducerClient {
    constructor(prefix,onConnect, onSent) {
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
        this.producer = new Kafka.Producer(this.kafkaConf);
        this.onConnect=onConnect;
        this.onSent=onSent;

    }

    connect() {
        const obj = this;

        this.producer.on("ready", function (arg) {
            obj.onConnect();
        });

        this.producer.connect();
    }

    genMessage(m) {return new Buffer.alloc(m.length,m)};

    sendMessage(topic,msgAsJson){
        const topicWithPrefix= this.prefix+topic;
        const msgAsStr = JSON.stringify(msgAsJson)
        this.producer.produce(topicWithPrefix,-1,this.genMessage(msgAsStr),uuid.v4());
        this.onSent(`[${topicWithPrefix}]`,msgAsJson)
    }

}


