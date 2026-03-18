// interface that all hash functions must adhere to. needed another hash implementation for testing
export default interface HashFunction {

    hash(salt: string, plaintext: string) : Promise<string> 
}