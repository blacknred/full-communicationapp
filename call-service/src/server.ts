import Debug from 'debug';
import * as fastify from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';
// import conf from '../config.ts';

const debug = Debug('call-service:errors');

const server: fastify.FastifyInstance = fastify({});

const opts: fastify.RouteShorthandOptions = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          pong: {
            type: 'string'
          }
        }
      }
    }
  },
  preHandler: async (request, reply) => {
    debug('authentication');
  },
}

server.get('/ping', opts, async (request, reply) => {
  return { pong: 'ok from call-server' }
})

server.listen(3000, (err) => {
  if (err) {
    debug(err);
    process.exit(1);
  }
  server.log.info(`🚀 at ${server.server.address().port}`)
})








