declare module "hash-wasm" {
  export function argon2id(options: {
    password: string
    salt: Uint8Array
    iterations: number
    memorySize: number
    parallelism: number
    hashLength: number
    outputType: "binary"
  }): Promise<Uint8Array>
}
