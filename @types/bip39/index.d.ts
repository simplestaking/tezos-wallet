//TODO: fix types
declare module 'bip39' {
    export function encode(string:any): string
    export function decode(string:any): string
    export function generateMnemonic(number:any): string
    export function mnemonicToSeed(mnemonic:any, passpharse:any): string
}