
export interface KafkaP {
    send(topic: string, value: string): Promise<void>
}