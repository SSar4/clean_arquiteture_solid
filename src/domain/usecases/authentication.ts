export interface Authentication {
    auth (email: string, senha: string): Promise<string>
}