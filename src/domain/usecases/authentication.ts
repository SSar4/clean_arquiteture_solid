export interface AuthenticationModel {
    email: string
    senha: string
}
export interface Authentication {
    auth (login: AuthenticationModel): Promise<string>
}