import * as Speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';

import * as EnvHandler from '../helpers/environment.handler';
const QR_NAME = EnvHandler.QR_ENV();

const gen_qrcode = (secret) => {
    return QRCode.toDataURL(secret.otpauth_url, { errorCorrectionLevel: 'M' });
}

export const generate2faAuthCode = (user_email) => {
    var secret = Speakeasy.generateSecret({ length: 20, name: QR_NAME + ' '+ user_email });
   return gen_qrcode(secret).then((url) => {
        return { "base32": secret.base32, "qrUrl": url };
    });
}

export const verify2faAuthCode = (secret, token) => {
    return (Speakeasy.totp.verify({
        secret: secret,
        encoding: "base32",
        token: token,
        window: 0
    }));
}
        