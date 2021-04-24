import getConfiguration from '../environments/environment';
 

/**
 * Get Host
 */
export const envPORT = () => getConfiguration().PORT;

export const envUSER = () => getConfiguration().USER;

export const envPASSWORD = () => getConfiguration().PASSWORD;

export const envJWT_SECRET = () => getConfiguration().JWT_SECRET;

export const envHOST = () => getConfiguration().HOST;

export const envDB_URL = () => getConfiguration().DB_URL;

export const QR_ENV = () => getConfiguration().QR_ENV;

 