import { sign, verify } from 'jsonwebtoken';
import { settings } from '../settings';

export function generateToken(object) {
    return sign(object, settings.jwtSecretToken, { expiresIn: '365d' });
}

export function decodeToken(token) {
    return verify(token, settings.jwtSecretToken);
}