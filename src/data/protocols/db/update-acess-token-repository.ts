export interface UpdateAcessToken {
    update (id: string, token: string): Promise<void>
}