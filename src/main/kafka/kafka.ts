import { Kafka, Producer, logLevel } from "kafkajs";
import { KafkaP } from '../../producer/producer'
export default class KafkaProducer implements KafkaP {
  public producer: Producer;

  constructor(groupId: string) {
    const kafka = new Kafka({
      clientId: "ms_create_Account",
      brokers: ["host.docker.internal:9094"],
    });
    this.producer = kafka.producer();
  }

  async send(topic: string, value: string) {
      
    await this.producer.connect();
    await this.producer.send({
      topic,
      messages: [
        {
          value,
        },
      ],
    });
    await this.producer.disconnect();
  }
}