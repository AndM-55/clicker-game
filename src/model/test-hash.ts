// an implementation of HashFunction that is used for testing with vitest
export default class TestHash {

    constructor() {}

    // this function just returns the plaintext again
    async hash(salt: string, plaintext: string) : Promise<string> {
        return Promise.resolve(plaintext);
    }
}