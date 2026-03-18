// an actual implementation of of a hashing functin that uses PBKDF2 and web API
export default class WebHash {
    constructor() {}

    async hash(salt: string, keyMaterial: string) : Promise<string> {
        let encoder = new TextEncoder();

        let passwordBytes = encoder.encode(keyMaterial);
        let saltBytes = encoder.encode(salt);

        const baseKey = await window.crypto.subtle.importKey(
            "raw",
            passwordBytes,
            "PBKDF2",
            false,
            ["deriveBits"]
        );

        const derivedBits = await window.crypto.subtle.deriveBits(
            {
                name: "PBKDF2",
                salt: saltBytes,
                iterations: 10000,
                hash: "SHA-256",
            },
            baseKey,
            256,
        );

        return Array.from(new Uint8Array(derivedBits))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }
}