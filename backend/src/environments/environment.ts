import environmentConfiguration from './environment.local';

export default function getConfiguration() {
    const Env = process.env.NODE_ENV;

    if (Env) {
        return environmentConfiguration;
    }
    throw new Error('Env not set');
}
