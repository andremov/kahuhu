import { hijackConsole } from './workers/logger';
hijackConsole();

import { getConfigValue, loadConfig } from './utils/config';
loadConfig();

import createKahuhuServer from './workers/server';

const server = createKahuhuServer();

const PORT = getConfigValue('port');
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

console.log('Kahuhu backend is running!');
