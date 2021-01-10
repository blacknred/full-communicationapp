import Debug from 'debug';
import * as http from 'http';
import { Config } from './types';

const debug = Debug('message-service:server');

const requestHandler = (req: http.IncomingMessage, res: http.ServerResponse) => {
  res.end(`Hello ${req.url}!`);
};

export default async(conf: Config) => {
  const server: http.Server = http.createServer(requestHandler);

  try {
    await server.listen(conf.port);
    debug(`🚀 at http://127.0.0.1:${conf.port}`);
  } catch (e) {
    debug(e);
  }
};