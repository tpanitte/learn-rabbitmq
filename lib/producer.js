const amqp = require("amqplib");

const data = {
  abc: "x",
};
const msg = Buffer.from(JSON.stringify(data));

const mq = amqp.connect("amqp://localhost");
mq.then(connect => connect.createChannel())
  .then(channel => {
    channel.assertExchange("logs", "fanout", { durable: true })
    const p = channel.publish("logs", "", msg);
    console.log(p);
  })
  .catch(error => console.log(error));
