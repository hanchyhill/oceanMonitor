import Env from './env';

let config = {
    env: Env,
    proxyTable: {'/api/':'http://localhost:10074',},
};
export default config;