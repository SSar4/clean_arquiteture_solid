import { AccountModel } from "../../domain/models/account";
import KafkaProducer from "./kafka";

export interface KafkaProducerModel {
     public(account: AccountModel): Promise<void>
}