import dotenv from 'dotenv';

dotenv.config({ path: `${__dirname}/./../../.env.${process.env.NODE_ENV}` });


const environmentConfiguration = {
    PORT: process.env.PORT,
    USER: process.env.USER,
    PASSWORD: process.env.PASSWORD,
    JWT_SECRET: process.env.JWT_SECRET,
    HOST: process.env.HOST,
    DB_URL: process.env.DB_URL,
    QR_ENV:process.env.QR_ENV
}



export default environmentConfiguration;
