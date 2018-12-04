declare module 'bs58check' {
    export function encode(string: Buffer): string
    export function decode(string: string): Buffer
}


