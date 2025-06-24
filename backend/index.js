import { loadConfig } from './src/utils/config';
loadConfig();

import { hijackConsole } from './src/workers/logger';
hijackConsole();

import createKahuhuServer from './src/server';

const server = createKahuhuServer();

server.listen(getConfigValue('port'), () => {
  console.log(`Server running on port ${PORT}`);
});
