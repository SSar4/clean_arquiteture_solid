import { AccountModel } from '../../domain/models/account'

export interface KafkaProducerModel {
  public: (account: AccountModel) => Promise<void>
}
