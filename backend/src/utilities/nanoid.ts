import crypto from "crypto"

export function nanoid(length: number): string {
    const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const bytes = crypto.randomBytes(length);

    for (let i = 0; i < bytes.length; i++) {
        result += characters[bytes[i] % characters.length];
    }

    return result;
}