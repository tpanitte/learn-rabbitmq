const amqp = require("amqplib");

const exch = "logs";

const mq = amqp.connect("amqp://localhost");
mq
  .then(connect => connect.createChannel())
  .then(channel => {
    return channel.assertExchange(exch, "fanout", { durable: false })
      .then(assert_x => {
        console.log(assert_x);
        return channel.assertQueue("", { exclusive: true })
          .then(assert_q => {
            console.log(assert_q);
            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", assert_q.queue);
            return channel.bindQueue(assert_q.queue, exch, "")
              .then(result => {
                console.log("queue: ", result);
                return channel.consume(assert_q.queue, msg => {
                  const content = msg.content.toString();
                  console.log("");
                  console.log("content: ", content);
                }, { noAck: true });
              });
          });
      });
  })
  .catch(error => console.log(error));
