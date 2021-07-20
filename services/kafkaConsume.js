// https://www.cloudkarafka.com/ הפעלת קפקא במסגרת ספק זה

const uuid = require("uuid");
const Kafka = require("node-rdkafka");

const kafkaConf = {
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

const prefix = "baepvu3o-";
const topic = `${prefix}new`;

const topics = [topic];
const consumer = new Kafka.KafkaConsumer(kafkaConf, {
  "auto.offset.reset": "beginning",
});

consumer.on("error", function (err) {
  console.error(err);
});
consumer.on("ready", function (arg) {
  console.log(`Consumer ${arg.name} ready`);
  consumer.subscribe(topics);
  consumer.consume();
});

consumer.on("data", function (m) {
  console.log(m.value.toString());
});
consumer.on("disconnected", function (arg) {
  process.exit();
});
consumer.on("event.error", function (err) {
  console.error(err);
  process.exit(1);
});
consumer.on("event.log", function (log) {
  console.log(log);
});
consumer.connect();
