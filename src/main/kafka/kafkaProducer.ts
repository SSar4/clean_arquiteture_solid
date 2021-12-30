import { AccountModel } from "../../domain/models/account";
import KafkaProducer from "./kafka";
import { KafkaProducerModel } from "./kafkaModel";

export class KafkaProducerMessage implements KafkaProducerModel {
    async public(account: AccountModel): Promise<void>{
       const kafkaProducer = new KafkaProducer('ms_create_account')
       await kafkaProducer.send('client_approved',JSON.stringify({id: account?.id, nome: account?.nome, email: account?.email}))
    }
}