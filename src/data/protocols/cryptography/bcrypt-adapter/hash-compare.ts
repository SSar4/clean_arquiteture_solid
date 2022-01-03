export interface HashCompare {
    compare (senha: string, hash: string): Promise<boolean | null>
}